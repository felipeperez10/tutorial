import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { z } from 'zod';
import { fetchCustomerById } from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const CustomerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  image_url: z.string().optional(),
});

// GET /api/customers/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const customer = await fetchCustomerById(id);

    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch customer.' },
      { status: 500 },
    );
  }
}

// PUT /api/customers/:id
// Body: { name, email, image_url? }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
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
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${imageUrl}
      WHERE id = ${id}
      RETURNING id, name, email, image_url
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update customer.' },
      { status: 500 },
    );
  }
}

// DELETE /api/customers/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM customers
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Customer not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Customer deleted successfully.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete customer.' },
      { status: 500 },
    );
  }
}
