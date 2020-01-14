import React from 'react';
import downloadIcon from '../images/download.svg';
import openInNewIcon from '../images/open_in_new.svg';

const Footer = () => {

    return (
      <div className="footer">
        <h3>For Developers</h3>

        <a href="https://api.trade.gov/apps/store/ita/resources#ita-taxonomies-api" target="_blank" rel="noopener noreferrer" title="opens new tab">
          Visit API Documentation  <img src={openInNewIcon} alt="opens new tab" />
        </a>
        <a download="ITA Taxonomy Definitions - External 032519.xlsx" href="documents/ITA Taxonomy Definitions - External 032519.xlsx" title="download the file">
          Download Taxonomy (92 kB) <img src={downloadIcon} alt="download the file" />
        </a>
      </div>
    )
}

export default Footer;