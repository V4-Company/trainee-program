CREATE TABLE astronauts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  nationality VARCHAR(100) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'active',
  deleted_at TIMESTAMP DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO astronauts (name, role, nationality, status) VALUES
  ('Valentina Cruz', 'Commander', 'Brazilian', 'active'),
  ('Elena Markov', 'Pilot', 'Russian', 'active'),
  ('Noah Patel', 'Engineer', 'Indian', 'active'),
  ('Liam O''Connor', 'Scientist', 'Irish', 'active'),
  ('Aiko Tanaka', 'Biologist', 'Japanese', 'active'),
  ('Miguel Herrera', 'Medic', 'Mexican', 'active'),
  ('Sara Ndlovu', 'Geologist', 'South African', 'active'),
  ('Lucas Meyer', 'Technician', 'German', 'active'),
  ('Hana Kim', 'Communications', 'South Korean', 'active'),
  ('Omar Farouk', 'Navigator', 'Egyptian', 'active'),
  ('Camila Souza', 'Engineer', 'Brazilian', 'inactive'),
  ('Daniel Novak', 'Pilot', 'Czech', 'active'),
  ('Fatima Al-Sayed', 'Scientist', 'UAE', 'active'),
  ('Thomas Reed', 'Commander', 'American', 'active'),
  ('Priya Singh', 'Medic', 'Indian', 'active'),
  ('Julien Moreau', 'Biologist', 'French', 'active'),
  ('Ines Duarte', 'Geologist', 'Portuguese', 'active'),
  ('Mateo Rojas', 'Technician', 'Chilean', 'active'),
  ('Zoe Walker', 'Navigator', 'Australian', 'active'),
  ('Anika Berg', 'Communications', 'Swedish', 'active');
