import React, { Component } from 'react'
import queryString from 'query-string'
import CheckableTag from 'antd/lib/tag/CheckableTag' // optimize
import Stars from 'react-stars'

class App extends Component {
  state = {
    name: '',
    stars: 0,
    tags: [],
    selectedTags: []
  }

  ratingChange = (stars) => {
    this.setState({ stars })
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

        delete selectedTags[index]

        return {
          selectedTags
        }
      })
    }
  }

  componentWillMount () {
    const { name, tags } = queryString.parse(window.location.search)

    this.setState({ name, tags })
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
        <h1 style={{ margin: '10px 0' }}>Отзыв о «{name}»</h1>

        <Stars
          count={5}
          onChange={this.ratingChange}
          half={false}
          value={stars}
          size={24}
          color2={'#ffd700'}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            maxWidth: '320px',
            margin: '15px 0'
          }}
        >
          {
            stars > 0 && stars < 4 && tags.map((tag, i) => {
              return (
                <CheckableTag
                  key={i}
                  style={{
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
      </div>
    )
  }
}

export default App
