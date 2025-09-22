import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

const fetchGames = () =>
  fetch("http://localhost:3000/games").then((res) => res.json())

const Games = () => {
  const { isError, isLoading, isSuccess, error, data } = useQuery({
    queryKey: ["games"],
    queryFn: fetchGames,
    retry: false,
    staleTime: Infinity,
  })

  return (
    <>
      {isError && <p>{error.message}</p>}
      {isLoading && <p>Carregando Informações...</p>}
      {isSuccess && (
        <div className="games">
          <h2>Jogos</h2>
          <ul>
            {data.map((game) => (
              <li key={game.id}>
                <a href={game.url} target="_blank" rel="noreferrer">
                  {game.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  )
}

const Form = () => {
  const queryClient = useQueryClient()
  const addGameMutation = useMutation({
    mutationFn: (newGame) =>
      fetch("http://localhost:3000/games", {
        method: "POST",
        body: JSON.stringify(newGame),
        headers: { "Content-type": "application/json" },
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["games"] }),
  })

  const handleFormSubmit = (e) => {
    e.preventDefault()
    const { title, url } = e.target.elements
    addGameMutation.mutate({
      id: crypto.randomUUID(),
      title: title.value,
      url: url.value,
    })
  }
  return (
    <div>
      <fieldset disabled={addGameMutation.isPending}>
        <legend>Adicionar Jogo</legend>
        <form onSubmit={handleFormSubmit}>
          <label>
            Nome:
            <input name="title" type="text" autoFocus />
          </label>
          <label>
            Link:
            <input name="url" type="url" />
          </label>
          <button>Adicionar</button>
        </form>
      </fieldset>
      {addGameMutation.isPending && <p>Adicionando jogo...</p>}
      {addGameMutation.isError && (
        <p>
          Algo inesperado aconteceu. Você pode tentar novamente ?
          {addGameMutation.error}
        </p>
      )}
    </div>
  )
}

const App = () => {
  return (
    <div className="app">
      <Games />
      <Form />
    </div>
  )
}

export { App }
