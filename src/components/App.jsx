import React, { PureComponent } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Circles } from 'react-loader-spinner';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { Searchbar } from './Searchbar/Searchbar';
import * as API from './services/api';
import { Button } from './Button/Button';

export default class App extends PureComponent {
  state = {
    images: [],
    query: '',
    page: 1,
    hitsPerPage: 12,
    isLoading: false,
    totalHits: null,
  };

  componentDidUpdate(prevProps, prevState) {
    const { page, query } = this.state;

    const prevQuery = prevState.query;
    const prevPage = prevState.page;

    if (prevPage !== page || prevQuery !== query) {
      this.getImages(query, page);
    }
  }

  getImages = async (query, pageAPI) => {
    const { hitsPerPage } = this.state;
    this.setState({ isLoading: true });

    try {
      const images = await API.addImages(query, pageAPI, hitsPerPage);

      if (images.hits.length === 0) {
        toast.error(
          `Sorry, there are no images matching your search: ${query}. Please try again.`
        );
        return;
      }
      this.setState(state => ({
        images: [...state.images, ...images.hits],
        totalHits: images.totalHits,
      }));
    } catch (error) {
      toast.error(`Sorry, something went wrong. Please try again.`);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleFormSubmit = query => {
    this.setState({ query, images: [], page: 1 });
  };

  handleLoadMoreBtn = () => {
    this.setState(state => ({ page: state.page + 1 }));
  };

  render() {
    const { images, isLoading, totalHits } = this.state;

    return (
      <div className="App">
        <Searchbar
          onSubmit={this.handleFormSubmit}
          isSubmiting={isLoading}
        ></Searchbar>

        <ToastContainer />

        {isLoading && (
          <Circles
            height="80"
            width="80"
            color="#3f51b5"
            ariaLabel="circles-loading"
            visible={true}
          />
        )}

        {images.length > 0 && <ImageGallery images={images} />}

        {!isLoading && images.length > 0 && images.length < totalHits && (
          <Button onClick={this.handleLoadMoreBtn} />
        )}
      </div>
    );
  }
}
