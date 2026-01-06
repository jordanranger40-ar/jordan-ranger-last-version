"use server";

import pool from "../index";


export const createPendingCardPayment = async ({
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
    VALUES ($1, $2, $3, $4, 'CARD', 'PENDING')
    RETURNING *
    `,
    [userId, cartId, amount, currency]
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

export const updatePaymentRawResponse = async (paymentId: string, raw: unknown) => {
  const result = await pool.query(
    `UPDATE payments
     SET raw_response = $2, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [paymentId, JSON.stringify(raw)]
  );
  return result.rows[0];
};
