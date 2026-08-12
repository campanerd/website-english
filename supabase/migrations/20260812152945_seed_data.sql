-- Nível Básico
insert into levels (slug, title, order_index, is_published)
values ('basico', 'Nível Básico', 0, true);

-- Tópicos do Nível Básico (sem PDF ainda — is_published fica false até o admin subir o material)
insert into topics (level_id, slug, title, order_index, is_published)
values
  ((select id from levels where slug = 'basico'), 'afirmacoes', 'Afirmações', 0, false),
  ((select id from levels where slug = 'basico'), 'negacoes', 'Negações', 1, false),
  ((select id from levels where slug = 'basico'), 'interrogacoes', 'Interrogações', 2, false),
  ((select id from levels where slug = 'basico'), 'interjeicoes', 'Interjeições', 3, false),
  ((select id from levels where slug = 'basico'), 'consoantes-e-vogais', 'Consoantes e Vogais', 4, false),
  ((select id from levels where slug = 'basico'), 'numeros', 'Números', 5, false),
  ((select id from levels where slug = 'basico'), 'pronomes', 'Pronomes', 6, false),
  ((select id from levels where slug = 'basico'), 'preposicoes', 'Preposições', 7, false),
  ((select id from levels where slug = 'basico'), 'auxiliares', 'Auxiliares', 8, false),
  ((select id from levels where slug = 'basico'), 'verbos-modais', 'Verbos Modais', 9, false),
  ((select id from levels where slug = 'basico'), 'verbos-essenciais', 'Verbos Essenciais', 10, false);

-- Conteúdo placeholder de "Quem Sou Eu" e "Contato" (edite depois pelo painel admin)
insert into site_content (key, content)
values
  ('about', '{
    "name": "Nome do Professor",
    "headline": "Aulas de inglês para todos os níveis",
    "bio": "Em breve, uma apresentação completa aqui.",
    "photo_path": null,
    "credentials": []
  }'::jsonb),
  ('contact', '{
    "whatsapp_number": "5511999999999",
    "whatsapp_message": "Olá! Gostaria de saber mais sobre as aulas de inglês.",
    "email": "contato@exemplo.com"
  }'::jsonb);