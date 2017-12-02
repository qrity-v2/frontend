import React, { Component } from 'react'
import queryString from 'query-string'
import CheckableTag from 'antd/lib/tag/CheckableTag' // optimize
import TextArea from 'antd/lib/input/TextArea' // optimize
import Stars from 'react-stars'

class App extends Component {
  state = {
    name: '',
    stars: 0,
    tags: [],
    selectedTags: [],
    comment: ''
  }

  ratingChange = (stars) => {
    if (stars > 3) {
      this.setState({ stars, selectedTags: [] })
    } else {
      this.setState({ stars })
    }
  }

  tagChange = (checked, tag) => {
    const { selectedTags } = this.state

    if (checked) {
      this.setState({
        selectedTags: [
          ...selectedTags,
          tag
        ]
      })
    } else {
      this.setState(({ selectedTags }) => {
        const index = selectedTags.indexOf(tag)

        selectedTags.splice(index, 1)

        return {
          selectedTags
        }
      })
    }
  }

  textareaChange = ({ target }) => {
    const { value: comment } = target

    this.setState({ comment })
  }

  send = () => {
    // Send form to API
  }

  componentWillMount () {
    const query = Object.entries(queryString.parse(window.location.search))

    if (!query.length) {
      return false
    }

    // DEMO [only]
    const state = Object.entries(queryString.parse(window.location.search))
      .filter(([ key, value ]) => [ 'tags', 'name' ].indexOf(key) > -1 && value !== undefined)
      .map(([ key, value ]) => ({ [key]: value }))
      .reduce((a, b) => ({ ...a, ...b }))

    this.setState({ ...state })
  }

  render () {
    const { name, stars, tags, selectedTags } = this.state

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
          Отзыв о {name ? `«${name}»` : 'заведении'}
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
            stars > 0 && stars < 4 && tags.map((tag, i) => {
              return (
                <CheckableTag
                  key={i}
                  style={{
                    height: 'auto',
                    fontSize: 15,
                    padding: '7px 19px',
                    margin: 5,
                    color: selectedTags.indexOf(tag) === -1 && 'rgba(0, 0, 0, 0.65)',
                    background: selectedTags.indexOf(tag) === -1 && '#eee'
                  }}
                  checked={selectedTags.indexOf(tag) > -1}
                  onChange={(checked) => this.tagChange(checked, tag)}
                >
                  {tag}
                </CheckableTag>
              )
            })
          }
        </div>

        {
          stars > 0 &&
            <TextArea
              placeholder='Напишите комментарий'
              style={{
                position: 'absolute',
                fontSize: 15,
                resize: 'none',
                padding: '5px 0',
                margin: '0 auto',
                maxWidth: '90%',
                minHeight: 'auto',
                borderRadius: 0,
                border: 0,
                boxSizing: 'border-box',
                borderBottom: '2px solid #eee',
                bottom: 70
              }}
              onChange={this.textareaChange}
              autosize={{
                maxRows: 8
              }}
            />
        }

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

export default App
