import React, { Component } from 'react'
import queryString from 'query-string'
import CheckableTag from 'antd/lib/tag/CheckableTag'
import Spin from 'antd/lib/spin'
import Stars from 'react-stars'
import status from './utils/status'
import json from './utils/json'

export default class App extends Component {
  state = {
    shop_name: '',
    user_id: 0,
    shop_id: 0,
    stars: 0,
    tags_good: [],
    tags_good_selected: [],
    tags_bad: [],
    tags_bad_selected: [],
    loading: false,
    bad_request: false
  }

  ratingChange = (stars) => {
    if (stars > 3) {
      this.setState({ stars, selectedTags: [] })
    } else {
      this.setState({ stars })
    }
  }

  tagChange = (checked, tag, type) => {
    const { [`tags_${type}_selected`]: selected } = this.state

    if (checked) {
      this.setState({
        [ `tags_${type}_selected` ]: [
          ...selected,
          tag
        ]
      })
    } else {
      this.setState(({ [`tags_${type}_selected`]: selected }) => {
        selected.splice(selected.indexOf(tag), 1)

        return {
          [`tags_${type}_selected`]: selected
        }
      })
    }
  }

  send = async () => {
    const {
      user_id,
      shop_id,
      stars: rating,
      tags_bad_selected,
      tags_good_selected
    } = this.state

    try {
      const { result } = await fetch('/review/', {
        method: 'post',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: queryString.stringify({
          shop_id,
          user_id,
          rating,
          tags: rating > 3 ? tags_good_selected : tags_bad_selected
        })
      }).then(status).then(json)

      if (result === 'ok') {
        // notification that all okay (maybe redirect...)
        alert('Good!')
      } else {
        alert('Error!')
      }
    } catch (err) {
      console.error(err)
    }
  }

  async componentWillMount () {
    const { user_id, shop_id } = queryString.parse(window.location.search)

    if (!(user_id && shop_id)) {
      return this.setState({
        bad_request: true
      })
    }

    this.setState({
      loading: true,
      user_id,
      shop_id
    })

    try {
      const { result } = await fetch('/review/params/')
        .then(status).then(json)

      this.setState({ ...result, loading: false })
    } catch (err) {
      console.error(err)
    }
  }

  render () {
    const {
      shop_name,
      stars,
      tags_good,
      tags_good_selected,
      tags_bad,
      tags_bad_selected,
      loading,
      bad_request
    } = this.state

    if (bad_request) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1>
            Не был передан shop_id & user_id.
          </h1>
        </div>
      )
    } else if (loading) {
      return (
        <div
          style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Spin />
        </div>
      )
    }

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          margin: '25px auto'
        }}
      >
        <h1
          style={{
            margin: '10px 0',
            fontSize: 30,
            textAlign: 'center'
          }}
        >
          Отзыв о {shop_name ? `«${shop_name}»` : 'заведении'}
        </h1>

        <Stars
          count={5}
          onChange={this.ratingChange}
          half={false}
          value={stars}
          size={32}
          color2={'#ffd700'}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            margin: '15px 0'
          }}
        >
          {
            (() => {
              if (stars === 0) {
                return false
              }

              return (stars > 3 ? tags_good : tags_bad).map((tag, i) => {
                return (
                  <CheckableTag
                    key={i}
                    style={{
                      height: 'auto',
                      fontSize: 15,
                      padding: '7px 19px',
                      margin: 5,
                      color: (stars > 3 ? tags_good_selected : tags_bad_selected).indexOf(tag) === -1 && 'rgba(0, 0, 0, 0.65)',
                      background: (stars > 3 ? tags_good_selected : tags_bad_selected).indexOf(tag) === -1 && '#eee'
                    }}
                    checked={(stars > 3 ? tags_good_selected : tags_bad_selected).indexOf(tag) > -1}
                    onChange={(checked) => this.tagChange(checked, tag, stars > 3 ? 'good' : 'bad')}
                  >
                    {tag}
                  </CheckableTag>
                )
              })
            })()
          }
        </div>

        {
          stars > 0 &&
            <span
              style={{
                fontWeight: 500,
                fontSize: 15,
                position: 'absolute',
                width: '100%',
                padding: '18px 0',
                color: '#fff',
                textAlign: 'center',
                background: '#108ee9',
                bottom: 0,
                borderRadius: 0
              }}
              onClick={this.send}
            >
              {
                'Отправить'.toUpperCase()
              }
            </span>
        }
      </div>
    )
  }
}
