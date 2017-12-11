import React from 'react';
// import ReactDOM from 'react-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { setInterval } from 'timers';
import counter from '../../../reducer';
import Layout from '../../../components/Layout';
import * as s from '../../../../node_modules/materialize-css/dist/css/materialize.min.css';
import fetchPosts from '../../../actions/postsActions';
// import Materialize from '../../../node_modules/materialize-css/dist/css'

const store = createStore(counter);

class Posts extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
    };
    this.fetchPostsComponentFunc = this.fetchPostsComponentFunc.bind(this);
  }

  componentDidMount() {
    axios.get(`http://www.reddit.com/r/${this.props.subreddit}/.json`)
      .then((res) => {
        const posts = res.data.data.children.map(obj => obj.data);
        // this.setState({ posts });
        posts.length = 6;
        this.forceUpdate(this.setState({ posts }));
      });
  }

  fetchPostsComponentFunc() {
    this.props.dispatch(fetchPosts());
    console.log('Got da posts!', this.props.dispatch(fetchPosts()));
  }

  render() {
    setInterval(this.fetchPostsComponentFunc, 30000);
    console.log('$$$$$$$$$$$$$$$$$$$$$$$ from posts component, this.props: ', this.props);
    const postsCardStyle = {
      margin: '0.5vh',
      fontWeight: 600,
      width: '30vw',
      height: '13vh',
      display: 'inline-block',
      textAlign: 'center',
      verticalAlign: 'top',
    };
    const posts = {
      status: this.state.posts,
    };
    console.log('---------------, posts.status: ', posts.status);
    // const result = posts.status.map(post =>
    //   (
    //     <li key={post.id} className={[s.card, s.small, s.lime].join(' ')} style={postsCardStyle}>
    //       <div className={s['card-content']}>
    //         <a href={post.url} className={s['black-text']}>
    //           <span className={s['center-align']}>{post.title}</span>
    //         </a>
    //       </div>
    //       <div className={s['card-action']}>
    //         <div className={[s.left, s['valign-wrapper']].join(' ')}>
    //           <a href={post.domain}>
    //             <span className={[s.chip, s.black, s['white-text']].join(' ')}>{post.domain}</span>
    //           </a>
    //         </div>
    //         <div className={[s.right, s['valign-wrapper']].join(' ')}>
    //           {// <span className={[s.chip, s.black, s['white-text']].join(' ')}>{post.score}</span>
    //           }
    //         </div>
    //       </div>
    //     </li>));
    return (
      <Provider store={store}>
        <Layout>
          <div>
            <h3>{`Posts from /r/${this.props.subreddit}`}</h3>
            <ul>
              <div>
                {this.state.posts.map(post =>
                (
                  <li key={post.id} className={[s.card, s.small, s.lime].join(' ')} style={postsCardStyle}>
                    <div className={s['card-content']}>
                      <a href={post.url} className={s['black-text']}>
                        <span className={s['center-align']}>{post.title}</span>
                      </a>
                    </div>
                    <div className={s['card-action']}>
                      <div className={[s.left, s['valign-wrapper']].join(' ')}>
                        <a href={post.domain}>
                          <span className={[s.chip, s.black, s['white-text']].join(' ')}>{post.domain}</span>
                        </a>
                      </div>
                      <div className={[s.right, s['valign-wrapper']].join(' ')}>
                        <span className={[s.chip, s.black, s['white-text']].join(' ')}>{post.score}</span>
                      </div>
                    </div>
                  </li>))
                }
                {/* { result } */}
              </div>
            </ul>
          </div>
        </Layout>
      </Provider>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts,
});

// const mapDispatchToProps = dispatch => ({
//   receive_posts: () => dispatch({
//     type: 'RECEIVE_POSTS',
//   }),
// });

Posts.propTypes = {
  subreddit: PropTypes.string,
  dispatch: PropTypes.func,
};

Posts.defaultProps = {
  subreddit: 'news/new',
  dispatch: {},
};

export default connect(mapStateToProps)(Posts);
// export default connect(mapDispatchToProps)(Posts);