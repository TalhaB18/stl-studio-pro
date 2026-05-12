
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.bump_import() from public, anon;
revoke execute on function public.upgrade_to_premium() from public, anon;
grant execute on function public.bump_import() to authenticated;
grant execute on function public.upgrade_to_premium() to authenticated;
