// Edite este arquivo para substituir o conteúdo de demonstração.
export const platform = {
  name: 'FIFA Members Club',
  headline: 'Area de Membros',
  description: 'Catalogo de mods com tutorial de instalacao e download para FIFA.',
}
export const tracks = [
  { id: 'mods-principais', name: 'Mods em destaque', order_index: 1 },
  { id: 'instalacao-suporte', name: 'Instalacao e ferramentas', order_index: 2 },
  { id: 'extras-gameplay', name: 'Gameplay e extras', order_index: 3 },
]
const moduleCatalog = [
  ['arquivos-essenciais', 'Arquivos Essenciais', 'Base obrigatoria para instalar os mods', 'mods-principais', '/media/mod-arsenal-essencial.png'],
  ['brasileirao-instalacao-mod', 'Brasileirao Instalacao + Mod', 'Jogos, mods, patches e atualizacoes nacionais', 'mods-principais', '/media/mod-brasileirao.png'],
  ['realismo-carreira', 'Realismo Modo Carreira', 'Ajustes para carreira mais imersiva', 'mods-principais'],
  ['mods-gameplay', 'Mods de gameplay', 'Jogabilidade, ritmo, fisica e equilibrio', 'extras-gameplay'],
  ['mods-financas', 'Mods de financas', 'Economia, contratos e ajustes de mercado', 'extras-gameplay'],
  ['mods-acessorios', 'Mods e acessorios', 'Faces, uniformes, chuteiras, placares e extras', 'extras-gameplay'],
  ['live-editor', 'Live Editor atualizado', 'Ferramenta atualizada e arquivos essenciais', 'instalacao-suporte'],
  ['instalacao-mods', 'Instalacao de mods', 'Passo a passo para instalar tudo corretamente', 'instalacao-suporte'],
  ['mods-brasileirao', 'Mods do Brasileirao', 'Times, ligas e atualizacoes nacionais', 'mods-principais'],
  ['mods-brasileiro', 'Mods brasileiros', 'Conteudos nacionais para deixar o jogo mais completo', 'mods-principais'],
]
export const modules = moduleCatalog.map(([id, title, subtitle, trackId, coverUrl = ''], index) => ({
  id, title, subtitle,
  description: 'Veja o tutorial de instalacao e use a descricao para acessar o download deste mod.',
  cover_url: coverUrl, track_id: trackId,
  order_index: index + 1,
  objectives: ['Assistir ao tutorial de instalacao.', 'Copiar o link de download na descricao.', 'Aplicar o mod no FIFA.'],
}))
export const lessons = modules.map(mod => ({
  id: `${mod.id}-tutorial`, module_id: mod.id, title: `Tutorial + download`,
  description: 'Assista ao video para ver como instalar.\n\nColoque aqui a descricao do mod e o link de download que a pessoa precisa acessar.',
  resources: [],
  video_url: '',
  order_index: 1,
}))
