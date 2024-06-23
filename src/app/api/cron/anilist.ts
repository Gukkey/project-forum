import { ApolloClient, ApolloQueryResult, InMemoryCache, gql } from "@apollo/client"

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://graphql.anilist.co",
  headers: {
    "Content-type": "application/json",
    Accept: "application/json"
  }
})

const FETCH_ANIME = gql`
  query fetch_anime($id: Int) {
    # Define which variables will be used in the query (id)
    Media(id: $id, type: ANIME) {
      # Insert our variables into the query arguments (id) (type: ANIME is hard-coded in the query)
      title {
        english
      }
      nextAiringEpisode {
        airingAt
        timeUntilAiring
        episode
      }
    }
  }
`

const FETCH_NEXT_EPISODE_AIRING_AT = gql`
query fetch_next_episode_airing_at($id: Int) {
    nextAiringEpisode($episode: Int) {
      airingAt
    }
  }
`
export async function fetchAnime(id: number): Promise<ApolloQueryResult<any>> {
  return await client.query({
    query: FETCH_ANIME,
    variables: { id: id }
  })
}

export async function fetchNextEpisodeAiringAt(
  nextEpisodeId: number
): Promise<ApolloQueryResult<any>> {
  return client.query({
    query: FETCH_NEXT_EPISODE_AIRING_AT,
    variables: { id: nextEpisodeId }
  })
}
