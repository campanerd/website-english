-- Número de WhatsApp real do professor, substituindo o placeholder do seed inicial.
update site_content
set
  content = jsonb_set(content, '{whatsapp_number}', '"5511945066872"'),
  updated_at = now()
where key = 'contact';
