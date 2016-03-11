import React, { PropTypes } from 'react'
import GraphiQL from 'graphiql'
import classes from './PlaygroundView.scss'

import 'graphiql/graphiql.css'

export default class PlaygroundView extends React.Component {
  static propTypes = {
    params: PropTypes.object.isRequired,
  };

  render () {
    const token = window.localStorage.getItem('token')
    const fetcher = (graphQLParams) => (
      fetch(`${__BACKEND_ADDR__}/graphql/${this.props.params.projectId}`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(graphQLParams),
      })
      .then((response) => response.json())
    )

    return (
      <div className={classes.root}>
        <GraphiQL fetcher={fetcher} />
      </div>
    )
  }
}
