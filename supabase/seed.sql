-- Seed data for Almira Custom development

-- Insert sample knowledge documents for Altamira projects
INSERT INTO knowledge_documents (title, category, project_id, content) VALUES
('Altamira Surubí - Información General', 'project', 'surubi',
'Altamira Surubí es un complejo residencial premium ubicado en el corazón de Surubí, Asunción.
Ofrece departamentos de 1, 2 y 3 dormitorios con amenities de primer nivel incluyendo piscina,
gimnasio, salón de eventos y seguridad 24/7. Precios desde USD 65,000. Entrega prevista: Diciembre 2026.'),

('Altavilla Luque - Descripción', 'project', 'altavilla',
'Altavilla Luque es un desarrollo residencial de 120 unidades en Luque, Gran Asunción.
Concepto eco-friendly con 65% de áreas verdes. Unidades desde USD 55,000 hasta USD 125,000.
Ideal para familias que buscan tranquilidad cerca de la ciudad.'),

('Alzara Plaza - Torre Premium', 'project', 'alzara',
'Alzara Plaza es una moderna torre de uso mixto en el centro de Asunción.
25 pisos con oficinas y departamentos. Área comercial en planta baja.
Enfocado en inversores que buscan alta rentabilidad.'),

('Proceso de Compra', 'faq', NULL,
'El proceso de compra en Altamira Group es simple: 1) Visita al showroom, 2) Elección de unidad,
3) Reserva con USD 1,000, 4) Firma de contrato, 5) Plan de pagos personalizado.
Aceptamos pagos en efectivo, transferencia bancaria y criptomonedas (Bitcoin y USDT).'),

('Documentación Necesaria', 'policy', NULL,
'Para iniciar el proceso de compra necesita: Cédula de Identidad vigente,
Comprobante de ingresos de los últimos 3 meses, Referencias comerciales y bancarias.
Para empresas: RUC, acta de constitución y poderes del representante.'),

('Planes de Financiación', 'pricing', NULL,
'Ofrecemos múltiples opciones de financiación: Plan 30/70 (30% inicial, 70% a la entrega),
Financiación propia hasta 48 meses, Facilidades con bancos aliados.
Descuento del 5% por pago al contado.');

-- Insert sample leads for testing
INSERT INTO leads (
  first_name,
  last_name,
  email,
  phone,
  project_interest,
  source,
  status,
  hubspot_id
) VALUES
('Juan', 'Pérez', 'juan.perez@example.com', '+595981123456', 'surubi', 'facebook', 'new', 'hs_001'),
('María', 'González', 'maria.gonzalez@example.com', '+595971234567', 'altavilla', 'instagram', 'contacted', 'hs_002'),
('Carlos', 'Rodríguez', 'carlos.rodriguez@example.com', '+595961345678', 'alzara', 'google', 'scheduled', 'hs_003');

-- Insert sample conversation context
INSERT INTO conversation_context (
  lead_id,
  phone_number,
  messages,
  summary
) VALUES
(
  (SELECT id FROM leads WHERE email = 'juan.perez@example.com'),
  '+595981123456',
  ARRAY[
    '{"role": "user", "content": "Hola, quiero información sobre Surubí"}',
    '{"role": "assistant", "content": "¡Hola Juan! Gracias por tu interés en Altamira Surubí. Es un complejo residencial premium con departamentos desde USD 65,000. ¿Te gustaría agendar una visita?"}'
  ]::JSONB[],
  'Lead interesado en Surubí, solicitó información de precios'
);

-- Insert sample metrics
INSERT INTO lead_metrics (
  date,
  total_leads,
  contacted,
  scheduled,
  visited,
  converted
) VALUES
(CURRENT_DATE - INTERVAL '2 days', 35, 30, 8, 5, 2),
(CURRENT_DATE - INTERVAL '1 day', 42, 38, 10, 6, 3),
(CURRENT_DATE, 28, 25, 7, 4, 1);