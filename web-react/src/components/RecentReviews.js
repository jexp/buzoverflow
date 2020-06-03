import React from 'react'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import Title from './Title'

const GET_RECENT_REVIEWS_QUERY = gql`
 {
  Question(first: 10, orderBy: created_desc) {
    id
    user {
      name: display_name
    }
    tags: tagged {
      name
    }
    date: created {
      formatted
    }
    title
    favoriteCount: favorite_count
  }
}
`

const UPVOTE_QUERY = gql`
 mutation upvote($id: Int!) {
  upvote(id: $id) {
    id
    favoriteCount: favorite_count
  }
}
`

export default function RecentReviews() {
  const { loading, error, data } = useQuery(GET_RECENT_REVIEWS_QUERY)
  const [upvote, { result }] = useMutation(UPVOTE_QUERY)
  if (error) return <p>Error</p>
  if (loading) return <p>Loading</p>

  return (
    <React.Fragment>
      <Title>Recent Questions</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Tags</TableCell>
            <TableCell>User Name</TableCell>
            <TableCell>Title</TableCell>
            <TableCell align="right">Favorite Count</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.Question.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date.formatted}</TableCell>
              <TableCell>{row.tags.map(x => x.name).join(", ")}</TableCell>
              <TableCell>{row.user.name}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell align="right">{row.favoriteCount}</TableCell>
              <TableCell align="right"><Button onClick={() => upvote({ variables: { id: row.id } })}>Upvote</Button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}
