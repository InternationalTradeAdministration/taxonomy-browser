import React from 'react';
import downloadIcon from '../images/download.svg';

const Footer = () => {

    return (
      <div className="footer">
        <h3>For Developers</h3>

        <a download="ITA Taxonomy Definitions - External 032519.xlsx" href="documents/ITA Taxonomy Definitions - External 032519.xlsx" title="download the file">
          Download Taxonomy (92 kB) <img src={downloadIcon} alt="download the file" />
        </a>
      </div>
    )
}

export default Footer;