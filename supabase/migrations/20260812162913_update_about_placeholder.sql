-- Conteúdo FICTÍCIO, só para visualizar o layout preenchido.
-- Substituir pelo texto real do professor assim que o painel admin (tarefa #9) estiver pronto.
update site_content
set
  content = '{
    "name": "Lucas Brunholi",
    "headline": "Professor de Inglês | Conversação e fluência para o dia a dia",
    "bio": "Ensino inglês há mais de 8 anos, sempre focado em fazer o aluno se sentir confiante pra falar de verdade — seja numa viagem, numa entrevista de emprego ou numa reunião de trabalho.\n\nAcredito que aprender um idioma não precisa ser chato ou cheio de regras decoradas. Por isso, minhas aulas combinam gramática aplicada, muita prática de conversação e material que eu mesmo preparo, organizado por nível, disponível gratuitamente aqui no site.\n\nJá acompanhei mais de 300 alunos, do zero ao avançado, e vou adorar te ajudar na sua jornada também.",
    "photo_path": null,
    "credentials": ["Cambridge C2 Proficiency", "+8 anos de experiência", "+300 alunos formados"]
  }'::jsonb,
  updated_at = now()
where key = 'about';
