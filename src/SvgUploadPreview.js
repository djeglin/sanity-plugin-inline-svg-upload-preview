import React from 'react';
import PropTypes from 'prop-types';
import { PatchEvent, set, unset } from 'part:@sanity/form-builder/patch-event';
import FormField from 'part:@sanity/components/formfields/default';
import SanitizedSVG from './sanitizedSvg';
import styles from './SvgUploadPreview.css';

class SvgStringInput extends React.Component {
  inputRef = React.createRef();

  static propTypes = {
    value: PropTypes.string,
    type: PropTypes.object,
    level: PropTypes.number,
    onChange: PropTypes.func,
  };

  handleChange = event => {
    const file = event.target.files[0];
    if (file.type !== 'image/svg+xml') {
      // eslint-disable-next-line no-alert
      window.alert(`The type of the selected file is not svg: ${file.type}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = readerEvent => {
      this.props.onChange(PatchEvent.from(set(readerEvent.target.result)));
    };
    reader.readAsText(file);
  };

  focus() {
    this.inputRef.current.focus();
  }

  clickedRemoveSvg() {
    if (confirm('Are you sure you want to remove the SVG?')) {
      this.props.onChange(PatchEvent.from(unset()))
    }
    return false
  }

  generateId() {
    const title = this.props.type.title.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => index == 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, '')
    return `svg-upload--${this.props.parent._key}--${title}`
  }

  render() {
    const { value, type, level } = this.props;
    const id = this.generateId();

    return (
      <FormField label={type.title} level={level} description={type.description}>
        <div className={`${styles.svgPreviewBackground} ${value && styles.hasValue}`}>
          <input
            accept=".svg"
            id={id}
            ref={this.inputRef}
            type="file"
            placeholder={type.placeholder}
            onChange={this.handleChange}
            name="svg_upload"
            onSubmit={this.onSubmit}
          />
          <label htmlFor={id}>Upload SVG</label>

          {value && (
            <div className={styles.svgWrapper}>
              <SanitizedSVG html={value} />
              <button
                className={styles.updateSvg}
                type="button"
                onClick={() => this.clickedRemoveSvg()}
              >
                Remove SVG
              </button>
            </div>
          )}
        </div>
      </FormField>
    );
  }
}

export default SvgStringInput;
