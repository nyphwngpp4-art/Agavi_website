export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const required = ["name", "company", "email", "message"];
    for (const field of required) {
      if (!body[field] || !String(body[field]).trim()) {
        return json({ error: `Missing required field: ${field}` }, 400);
      }
    }

    const lead = {
      ...body,
      name: String(body.name).trim(),
      company: String(body.company).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone || "").trim(),
      message: String(body.message).trim(),
      receivedAt: new Date().toISOString(),
      website: "agaviai.com"
    };

    const events = [];

    // 1) Forward to Make/Zapier for email + CRM + sheets + notifications
    if (env.MAKE_WEBHOOK_URL) {
      const makeResponse = await fetch(env.MAKE_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pipeline: "agavi_lead_intake",
          lead
        })
      });

      events.push({
        target: "make",
        ok: makeResponse.ok,
        status: makeResponse.status
      });
    }

    // 2) Optional direct push to Agavi / OpenClaw if you expose an endpoint
    if (env.AGAVI_WEBHOOK_URL) {
      const headers = { "Content-Type": "application/json" };
      if (env.AGAVI_WEBHOOK_TOKEN) {
        headers["Authorization"] = `Bearer ${env.AGAVI_WEBHOOK_TOKEN}`;
      }

      const agaviResponse = await fetch(env.AGAVI_WEBHOOK_URL, {
        method: "POST",
        headers,
        body: JSON.stringify({
          type: "lead_intake",
          assistant: "Agavi",
          lead
        })
      });

      events.push({
        target: "agavi",
        ok: agaviResponse.ok,
        status: agaviResponse.status
      });
    }

    return json({
      ok: true,
      message: "Lead submitted successfully.",
      events
    });
  } catch (error) {
    return json({
      error: "Invalid request.",
      detail: error instanceof Error ? error.message : "Unknown error"
    }, 400);
  }
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store"
    }
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    }
  });
}