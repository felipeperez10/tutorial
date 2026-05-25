'use server';

import { z } from 'zod';
import postgres from 'postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// ─── Types ────────────────────────────────────────────────────────────────────

export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

// ─── Schema ───────────────────────────────────────────────────────────────────

const CustomerSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  image_url: z.string().optional(),
});

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createCustomer(prevState: State, formData: FormData): Promise<State> {
  const validatedFields = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;
  const imageUrl = image_url ?? '/customers/default.png';

  try {
    await sql`
      INSERT INTO customers (name, email, image_url)
      VALUES (${name}, ${email}, ${imageUrl})
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to create customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

// ─── Update ───────────────────────────────────────────────────────────────────

export async function updateCustomer(
  id: string,
  prevState: State,
  formData: FormData,
): Promise<State> {
  const validatedFields = CustomerSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    image_url: formData.get('image_url') || undefined,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update customer.',
    };
  }

  const { name, email, image_url } = validatedFields.data;
  const imageUrl = image_url ?? '/customers/default.png';

  try {
    await sql`
      UPDATE customers
      SET name = ${name}, email = ${email}, image_url = ${imageUrl}
      WHERE id = ${id}
    `;
  } catch (error) {
    console.error('Database Error:', error);
    return { message: 'Database Error: Failed to update customer.' };
  }

  revalidatePath('/dashboard/customers');
  redirect('/dashboard/customers');
}

// ─── Delete ───────────────────────────────────────────────────────────────────

export async function deleteCustomer(id: string): Promise<void> {
  try {
    await sql`DELETE FROM customers WHERE id = ${id}`;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Database Error: Failed to delete customer.');
  }

  revalidatePath('/dashboard/customers');
}
