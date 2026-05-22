import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { z } from 'zod';
import { fetchProductById } from '@/app/lib/data';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

const ProductSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce.number().gt(0, { message: 'Price must be greater than $0.' }),
  stock: z.coerce
    .number()
    .int({ message: 'Stock must be a whole number.' })
    .gte(0, { message: 'Stock cannot be negative.' }),
});

// GET /api/products/:id
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const product = await fetchProductById(id);

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product.' },
      { status: 500 },
    );
  }
}

// PUT /api/products/:id
// Body: { name, description, price, stock }
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedFields = ProductSchema.safeParse(body);

    if (!validatedFields.success) {
      return NextResponse.json(
        { errors: validatedFields.error.flatten().fieldErrors },
        { status: 400 },
      );
    }

    const { name, description, price, stock } = validatedFields.data;

    const result = await sql`
      UPDATE products
      SET name = ${name}, description = ${description}, price = ${price}, stock = ${stock}
      WHERE id = ${id}
      RETURNING id, name, description, price, stock
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(result[0], { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update product.' },
      { status: 500 },
    );
  }
}

// DELETE /api/products/:id
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const result = await sql`
      DELETE FROM products
      WHERE id = ${id}
      RETURNING id
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { message: 'Product deleted successfully.' },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete product.' },
      { status: 500 },
    );
  }
}
