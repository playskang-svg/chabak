// 여행 일정 생성과 장소 질문을 처리하는 Edge Function.
//
// Claude API 키는 여기(서버 환경변수)에만 있습니다. 브라우저 번들에는 들어가지 않습니다.
// 필요한 시크릿:
//   ANTHROPIC_API_KEY    — Claude API 키
//   CHABAK_AI_PASSWORD   — AI 기능을 쓰기 위한 공유 암호 (없으면 AI 기능이 꺼집니다)
// SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY 는 Supabase가 자동으로 넣어 줍니다.

import Anthropic from 'npm:@anthropic-ai/sdk@0.120.0';
import { createClient } from 'npm:@supabase/supabase-js@2.112.3';

const MODEL = 'claude-opus-5';

// 시간당 호출 상한. 주소가 공개돼 있어도 요금이 폭주하지 않게 막습니다.
const HOURLY_LIMIT: Record<string, number> = { plan: 5, ask: 30 };

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });

const POINT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: '장소 이름. 지도 앱에서 검색되는 실제 명칭.' },
    type: {
      type: 'string',
      enum: ['start', 'waypoint', 'stay', 'end'],
      description: '출발지 / 경유지 / 숙박·차박지 / 도착지',
    },
    lat: { type: 'number', description: '위도' },
    lng: { type: 'number', description: '경도' },
    desc: { type: 'string', description: '이 장소를 왜 들르는지 2~3문장 설명' },
    tips: { type: 'string', description: '주차, 소요 시간, 주의사항 등 실용적인 팁 한 줄' },
    restroom: { type: 'boolean', description: '화장실 유무 (숙박지가 아니면 false)' },
    shower: { type: 'boolean', description: '샤워 시설 유무 (숙박지가 아니면 false)' },
    private_spot: { type: 'boolean', description: '조용하고 프라이빗한지 (숙박지가 아니면 false)' },
  },
  required: ['name', 'type', 'lat', 'lng', 'desc', 'tips', 'restroom', 'shower', 'private_spot'],
  additionalProperties: false,
};

const PLAN_TOOL = {
  name: 'save_travel_plan',
  description: '요청받은 조건에 맞는 여행 일정과 준비물을 저장합니다.',
  strict: true,
  input_schema: {
    type: 'object',
    properties: {
      title: { type: 'string', description: '앱 상단에 보일 여행 제목. 이모지 하나 정도 포함.' },
      subtitle: { type: 'string', description: '한 줄 요약 부제' },
      primary_label: { type: 'string', description: '준비물 첫 번째 묶음 이름 (예: 내 짐)' },
      secondary_label: { type: 'string', description: '준비물 두 번째 묶음 이름 (예: 아토 짐)' },
      days: {
        type: 'array',
        description: '일차별 일정',
        items: {
          type: 'object',
          properties: {
            title: { type: 'string', description: '예: 1일차: 천안 출발 → 영덕' },
            points: { type: 'array', items: POINT_SCHEMA },
          },
          required: ['title', 'points'],
          additionalProperties: false,
        },
      },
      checklist: {
        type: 'array',
        description: '이 여행에 필요한 준비물',
        items: {
          type: 'object',
          properties: {
            text: { type: 'string' },
            group: {
              type: 'string',
              enum: ['primary', 'secondary'],
              description: 'primary=첫 번째 묶음, secondary=두 번째 묶음',
            },
          },
          required: ['text', 'group'],
          additionalProperties: false,
        },
      },
    },
    required: ['title', 'subtitle', 'primary_label', 'secondary_label', 'days', 'checklist'],
    additionalProperties: false,
  },
};

const PLAN_SYSTEM = `당신은 한국 여행 일정을 짜는 플래너입니다. 사용자의 요청을 읽고 save_travel_plan 도구로 일정을 저장하세요.

지켜야 할 것:
- 모든 글은 한국어로, 실제 여행자가 읽을 문장으로 씁니다.
- 좌표는 실제로 존재하는 장소의 대략적인 위치여야 합니다. 확실하지 않으면 널리 알려진 랜드마크를 고르세요.
- 하루에 3~6곳이 적당합니다. 이동 시간을 감안해 무리한 동선을 만들지 마세요.
- 첫날 첫 장소는 type을 start, 마지막 날 마지막 장소는 end 로 합니다.
- 숙박하는 날은 그날 마지막 장소를 stay 로 하고 시설 정보를 채웁니다.
- 사용자가 조건(반려동물, 차종, 예산 등)을 말했다면 desc와 tips에 그 조건을 반영하세요.
- 사용자가 어떤 장소를 "갈지 말지" 고민한다고 하면 그 장소 이름 앞에 [선택] 을 붙이세요.`;

const ASK_SYSTEM = `당신은 여행지 안내인입니다. 여행자가 특정 장소에 대해 묻습니다.

- 한국어로 3~5문장 이내로 답하세요.
- 확실하지 않은 사실은 단정하지 말고 "확인이 필요하다"고 밝히세요. 지어내지 마세요.
- 운영시간, 요금, 반려동물 출입 같은 정보는 바뀔 수 있다는 점을 필요할 때 덧붙이세요.`;

const admin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// 시간당 호출 수를 확인하고, 통과하면 이번 호출을 기록합니다.
async function checkRateLimit(clientKey: string, action: string): Promise<string | null> {
  const limit = HOURLY_LIMIT[action] ?? 10;
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const { count, error } = await admin
    .from('chabak_ai_calls')
    .select('id', { count: 'exact', head: true })
    .eq('client_key', clientKey)
    .eq('action', action)
    .gte('created_at', since);

  if (error) return null; // 제한 확인 실패로 기능을 막지는 않습니다.
  if ((count ?? 0) >= limit) {
    return `한 시간에 ${limit}번까지만 사용할 수 있습니다. 잠시 후 다시 시도해 주세요.`;
  }

  await admin.from('chabak_ai_calls').insert({ client_key: clientKey, action });
  return null;
}

// deno-lint-ignore no-explicit-any
function toolInput(response: any) {
  const block = response.content.find((b: any) => b.type === 'tool_use');
  if (!block?.input) throw new Error('일정을 만들지 못했습니다. 프롬프트를 조금 더 구체적으로 적어 보세요.');
  return block.input as Record<string, never>;
}

// 모델이 만든 일정을 앱이 쓰는 모양으로 바꿉니다. id는 여기서 정해 중복을 막습니다.
function toItinerary(days: Array<Record<string, never>>) {
  return days.map((day, dayIndex) => ({
    day: dayIndex + 1,
    title: String(day.title ?? `${dayIndex + 1}일차`),
    points: (Array.isArray(day.points) ? day.points : []).map((p: Record<string, never>, i: number) => {
      const lat = Number(p.lat);
      const lng = Number(p.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) {
        throw new Error(`좌표가 올바르지 않습니다: ${String(p.name)}`);
      }
      const point: Record<string, unknown> = {
        id: `d${dayIndex + 1}-${i + 1}`,
        name: String(p.name ?? '이름 없음'),
        type: ['start', 'waypoint', 'stay', 'end'].includes(String(p.type)) ? String(p.type) : 'waypoint',
        coords: [lat, lng],
        desc: String(p.desc ?? ''),
        tips: String(p.tips ?? ''),
      };
      if (point.type === 'stay') {
        point.facilities = {
          restroom: Boolean(p.restroom),
          shower: Boolean(p.shower),
          private: Boolean(p.private_spot),
        };
      }
      return point;
    }),
  }));
}

async function handlePlan(anthropic: Anthropic, prompt: string) {
  if (prompt.length < 5) throw new Error('어떤 여행인지 조금 더 적어 주세요.');

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 16000,
    system: PLAN_SYSTEM,
    output_config: { effort: 'medium' },
    tools: [PLAN_TOOL] as never,
    tool_choice: { type: 'tool', name: 'save_travel_plan' },
    messages: [{ role: 'user', content: prompt }],
  });

  const plan = toolInput(response);
  const itinerary = toItinerary(plan.days as unknown as Array<Record<string, never>>);
  if (itinerary.length === 0) throw new Error('일정이 비어 있습니다.');

  const config = {
    title: String(plan.title ?? '여행 일정'),
    subtitle: String(plan.subtitle ?? ''),
    prompt,
    checklistLabels: {
      human: String(plan.primary_label ?? '내 짐'),
      dog: String(plan.secondary_label ?? '함께 가는 이의 짐'),
    },
  };

  const checklist = (plan.checklist as unknown as Array<Record<string, string>> ?? []).map((item) => ({
    id: crypto.randomUUID(),
    text: String(item.text ?? ''),
    completed: false,
    category: item.group === 'secondary' ? 'dog' : 'human',
  }));

  // 이전 여행의 흔적(메모·방문 도장·경로 선택)은 새 일정과 id가 맞지 않으므로 함께 정리합니다.
  // 사진은 지우지 않습니다 — 되돌릴 수 없는 데이터라 사용자가 직접 지우게 둡니다.
  await admin.from('chabak_trip_docs').upsert([
    { key: 'itinerary', data: itinerary, updated_at: new Date().toISOString() },
    { key: 'config', data: config, updated_at: new Date().toISOString() },
  ], { onConflict: 'key' });
  await admin.from('chabak_trip_docs').delete().eq('key', 'route');
  await admin.from('chabak_memos').delete().neq('point_id', '');
  await admin.from('chabak_visits').delete().neq('point_id', '');
  await admin.from('chabak_place_answers').delete().neq('point_id', '');
  await admin.from('chabak_checklist_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (checklist.length > 0) await admin.from('chabak_checklist_items').insert(checklist);

  return { config, days: itinerary.length, points: itinerary.reduce((n, d) => n + d.points.length, 0) };
}

async function handleAsk(
  anthropic: Anthropic,
  body: { pointId?: string; pointName?: string; pointDesc?: string; question?: string },
) {
  const question = String(body.question ?? '').trim();
  if (!question) throw new Error('질문을 입력해 주세요.');

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2000,
    system: ASK_SYSTEM,
    output_config: { effort: 'low' },
    messages: [{
      role: 'user',
      content: `장소: ${body.pointName ?? ''}\n설명: ${body.pointDesc ?? ''}\n\n질문: ${question}`,
    }],
  });

  const answer = (response.content as Array<{ type: string; text?: string }>)
    .filter((b) => b.type === 'text')
    .map((b) => b.text ?? '')
    .join('\n')
    .trim();

  if (!answer) throw new Error('답변을 받지 못했습니다.');

  const { data, error } = await admin
    .from('chabak_place_answers')
    .insert({ point_id: body.pointId, question, answer })
    .select('id, point_id, question, answer')
    .single();
  if (error) throw new Error(error.message);

  return { answer: data };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS_HEADERS });
  if (req.method !== 'POST') return json({ error: 'POST만 지원합니다.' }, 405);

  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  const sharedPassword = Deno.env.get('CHABAK_AI_PASSWORD');
  if (!apiKey || !sharedPassword) {
    return json({ error: 'AI 기능이 아직 설정되지 않았습니다. Supabase 시크릿에 ANTHROPIC_API_KEY 와 CHABAK_AI_PASSWORD 를 넣어 주세요.' }, 503);
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return json({ error: '요청을 읽지 못했습니다.' }, 400);
  }

  if (body.password !== sharedPassword) {
    return json({ error: '생성 암호가 맞지 않습니다.' }, 401);
  }

  const action = body.action;
  if (action !== 'plan' && action !== 'ask') {
    return json({ error: '알 수 없는 요청입니다.' }, 400);
  }

  const clientKey = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
  const limited = await checkRateLimit(clientKey, action);
  if (limited) return json({ error: limited }, 429);

  try {
    const anthropic = new Anthropic({ apiKey });
    const result = action === 'plan'
      ? await handlePlan(anthropic, String(body.prompt ?? '').trim())
      : await handleAsk(anthropic, body);
    return json(result);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.' }, 500);
  }
});
