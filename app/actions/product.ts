'use server';

import postgres from 'postgres';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const sql = postgres(process.env.POSTGRES_URL!, { ssl: 'require' });

// Forma del objeto devuelto al formulario después de que se ejecuta una acción en el servidor.
// `errors` contiene mensajes de validación a nivel de campo.
// `message` contiene un mensaje general de éxito o de error.
export type State = {
  errors?: Record<string, string[]>;
  message?: string | null;
};

// ─── Validation schema ────────────────────────────────────────────────────────

const ProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: 'Name is required.' }),
  description: z.string().min(1, { message: 'Description is required.' }),
  price: z.coerce
    .number()
    .gt(0, { message: 'Please enter a price greater than $0.' }),
  stock: z.coerce
    .number()
    .int({ message: 'Stock must be a whole number.' })
    .gte(0, { message: 'Stock cannot be negative.' }),
});

// Esquemas derivados: omitir campos que la acción llena automáticamente
const CreateProduct = ProductSchema.omit({ id: true });
const UpdateProduct = ProductSchema;

// ─── Create ───────────────────────────────────────────────────────────────────

export async function createProduct(
  prevState: State,
  formData: FormData,
): Promise<State> {
  // 1. Validar — safeParse devuelve { success, data } o { success, error }
  //    en lugar de lanzar una excepción, así podemos retornar los errores al formulario

  const validatedFields = CreateProduct.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock'),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to create product.',
    };
  }

  // 2. Preparar — el precio se guarda directamente en pesos
  const { name, description, price, stock } = validatedFields.data;

  // 3. Guardar
  try {
    await sql`
      INSERT INTO products (name, description, price, stock)
      VALUES (${name}, ${description}, ${price}, ${stock})
    `;
  } catch {
    return { message: 'Database Error: Failed to create product.' };
  }

  // 4. Revalidar la caché de la lista de productos y redirigir
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}

// update

export async function updateProduct(
  id: string,
  prevState: State,
  formData: FormData
): Promise<State> {
  const validatedFields = UpdateProduct.safeParse({
    id,
    name: formData.get('name'),
    description: formData.get('description'),
    price: formData.get('price'),
    stock: formData.get('stock')

  });
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing or invalid fields. Failed to update product',
    };
  }
  const { name, description, price, stock } = validatedFields.data;

  //Update
  try {
    await sql`
    UPDATE products
    SET 
      name = ${name},
      description = ${description},
      price = ${price},
      stock = ${stock}
    WHERE id = ${id}
    `;
  }catch{
    return { message: 'Database Error: Failed to update product' };
  }
  revalidatePath('/dashboard/products');
  redirect('/dashboard/products');
}



