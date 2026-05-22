import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';
import { z } from 'zod';
import { fetchFilteredProducts, fetchProductsPages } from '@/app/lib/data';

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

// GET /api/products?query=xxx&page=1
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') ?? '';
    const page = Number(searchParams.get('page') ?? '1');

    const [products, totalPages] = await Promise.all([
      fetchFilteredProducts(query, page),
      fetchProductsPages(query),
    ]);

    return NextResponse.json({ products, totalPages }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch products.' },
      { status: 500 },
    );
  }
}

// POST /api/products
// Body: { name, description, price, stock }
export async function POST(request: NextRequest) {
  try {
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
      INSERT INTO products (name, description, price, stock)
      VALUES (${name}, ${description}, ${price}, ${stock})
      RETURNING id, name, description, price, stock
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product.' },
      { status: 500 },
    );
  }
}
