import { neon } from "@neondatabase/serverless";

export async function GET({ request }) {
  const url = new URL(request.url);
  const query = url.searchParams.get('query') || '';

  const sql = neon(import.meta.env.DATABASE_URL);

  // Consulta para buscar alimentos y grupos
  const result = await sql`
    SELECT 
      a.id,
      a.nombre, 
      g.nombre AS grupo
    FROM public.alimentos a
    LEFT JOIN public.grupos_alimentos g ON a.grupo_id = g.id
    WHERE a.nombre ILIKE ${`%${query}%`} OR g.nombre ILIKE ${`%${query}%`}
    ORDER BY a.nombre ASC;
  `;
  
  // Devolver los resultados en formato JSON
  return new Response(JSON.stringify(result), {
    headers: { 'Content-Type': 'application/json' },
  });
}
