import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { z } from 'zod';
import { fetchFilteredCustomers } from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CustomerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  image_url: z.string().optional(),
});

// GET /api/customers?query=xxx
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';
    const customers = await fetchFilteredCustomers(query);
    return NextResponse.json(customers, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customers.' },
      { status: 500 },
    );
  }
}

// POST /api/customers
// Body: { name, email, image_url? }
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedFields = CustomerSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, email, image_url } = validatedFields.data;
    const imageUrl = image_url ?? '/customers/default.png';

    const result = await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl})
      RETURNING id, name, email, image_url
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create customer.' },
      { status: 500 },
    );
  }
}
