"use server";

import { NewPayment } from "@/types/index";
import pool from "../index";

export const createPendingCardPayment = async (data: NewPayment) => {
  const result = await pool.query(
    `
    INSERT INTO payments 
      (user_id, cart_id, amount, currency, method, status, 
       billing_street, billing_city, billing_state, billing_country, billing_postal_code,
       customer_email, customer_first_name, customer_last_name)
    VALUES 
      ($1, $2, $3, $4, 'CARD', 'PENDING', $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *
    `,
    [
      data.user_id,
      data.cart_id,
      data.amount,
      data.currency,
      data.billing_street ?? "",
      data.billing_city ?? "",
      data.billing_state ?? "",
      data.billing_country ?? "",
      data.billing_postal_code ?? "",
      data.customer_email ?? "",
      data.customer_first_name ?? "",
      data.customer_last_name ?? "",
    ]
  );

  return result.rows[0];
};

export const updatePaymentCheckoutId = async (
  paymentId: string,
  checkoutId: string
) => {
  const result = await pool.query(
    `
    UPDATE payments
    SET checkout_id = $2
    WHERE id = $1
    RETURNING *
    `,
    [paymentId, checkoutId]
  );

  return result.rows[0];
};

export const markPaymentPaid = async (checkoutId: string) => {
  const result = await pool.query(
    `
    UPDATE payments
    SET status = 'PAID'
    WHERE checkout_id = $1
    RETURNING *
    `,
    [checkoutId]
  );

  return result.rows[0];
};

export const markPaymentFailed = async (checkoutId: string) => {
  const result = await pool.query(
    `
    UPDATE payments
    SET status = 'FAILED'
    WHERE checkout_id = $1
    RETURNING *
    `,
    [checkoutId]
  );

  return result.rows[0];
};

export const createCodPayment = async ({
  userId,
  cartId,
  amount,
  currency,
}: {
  userId: string;
  cartId: string;
  amount: number;
  currency: string;
}) => {
  const result = await pool.query(
    `
    INSERT INTO payments (user_id, cart_id, amount, currency, method, status)
    VALUES ($1, $2, $3, $4, 'COD', 'PAID')
    RETURNING *
    `,
    [userId, cartId, amount, currency]
  );

  return result.rows[0];
};

export const updatePaymentRawResponse = async (
  paymentId: string,
  raw: unknown
) => {
  const result = await pool.query(
    `UPDATE payments
     SET raw_response = $2, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [paymentId, JSON.stringify(raw)]
  );
  return result.rows[0];
};

export async function updatePaymentBillingDetails(
  paymentId: string,
  billing: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  }
) {
  const query = `
    UPDATE payments
    SET
      billing_street = $1,
      billing_city = $2,
      billing_state = $3,
      billing_country = $4,
      billing_postcode = $5,
      updated_at = NOW()
    WHERE id = $6
  `;

  const values = [
    billing.street,
    billing.city,
    billing.state,
    billing.country,
    billing.postalCode,
    paymentId,
  ];

  await pool.query(query, values);
}
