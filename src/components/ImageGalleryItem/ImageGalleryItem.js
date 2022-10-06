import PropTypes from 'prop-types';
import { Component } from 'react';
import { Modal } from '../Modal/Modal';

export class ImageGalleryItem extends Component {
  state = {
    isModalOpen: false,
  };

  toggleModal = () => {
    this.setState(state => ({ isModalOpen: !state.isModalOpen }));
    };
    
  render() {
    const { isModalOpen } = this.state;
    const { smallURL, alt, largeURL } = this.props;
    return (
      <li className="ImageGalleryItem">
        <img
          src={smallURL}
          alt={alt}
          className="ImageGalleryItem-image"
          onClick={this.toggleModal}
        />
        {isModalOpen && (
          <Modal
            closeFn={this.toggleModal}
            largeImageURL={largeURL}
            alt={alt}
          />
        )}
      </li>
    );
  }
}
ImageGalleryItem.propTypes = {
  smallURL: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  largeURL: PropTypes.string.isRequired,
};
