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
    LoadMoreBtn: false,
  };

  getImages = async (query, pageAPI = 1) => {
    const { hitsPerPage, page } = this.state;
    this.setState({ isLoading: true, LoadMoreBtn: false });

    try {
      const images = await API.addImages(query, pageAPI, hitsPerPage);

      if (images.hits.length === 0) {
        toast.error(
          `Sorry, there are no images matching your search: ${query}. Please try again.`
        );
        return;
      } else if (images.totalHits <= hitsPerPage) {
        this.setState(state => ({
          images: [...state.images, ...images.hits],
          LoadMoreBtn: false,
        }));
        return;
      } else if (Math.ceil(images.totalHits / hitsPerPage) === page) {
        this.setState(state => ({
          images: [...state.images, ...images.hits],
          LoadMoreBtn: false,
        }));
        return;
      }

      this.setState(state => ({
        images: [...state.images, ...images.hits],
        page: state.page + 1,
        LoadMoreBtn: true,
      }));
    } catch (error) {
      toast.error(`Sorry, something went wrong. Please try again.`);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleFormSubmit = query => {
    this.setState({ query, images: [], page: 1 });
    this.getImages(query);
  };

  render() {
    const { images, isLoading, query, page, LoadMoreBtn } = this.state;

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

        {LoadMoreBtn && <Button onClick={() => this.getImages(query, page)} />}
      </div>
    );
  }
}
