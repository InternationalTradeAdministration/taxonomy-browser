[![Build Status](https://travis-ci.org/GovWizely/taxonomy-browser.svg?branch=master)](https://travis-ci.org/GovWizely/taxonomy-browser)

# Thesaurus of International Trade Terms

The International Trade Administration’s (ITA) Thesaurus of International Trade Terms is a controlled and structured list of words and phrases used to tag and index information found on the ITA’s websites and databases. The thesaurus covers all subjects related to international trade and foreign investment with particular emphasis on exporting, trade promotion, market access and enforcement and compliance.

The thesaurus is structured into four domains or micro-thesauri:

* Trade Topics
* Industries
* Geographic Locations
* U.S. Government (U.S. Trade Initiatives)

The thesaurus was developed by ITA’s staff of international trade specialists, consulting several authoritative sources and vocabularies covering the language of international trade and investment.

## Run locally

* Install Node.js (this app was developed with LTS v8.16.0).
* Install dependencies with `npm install`.
* Then, `npm run start` launches the app in development mode, with changes viewable at [http://localhost:3000](http://localhost:3000).  
  * The page will reload if you make edits.<br>
  * You will also see any lint errors in the console.

## Running tests

In one terminal tab, launch server with `npm run start`.  
In another terminal tab, launch tests with `npm run test`.  
Expect the suite to pass within 10 seconds (depending on network speed).

## Build and Deploy to GitHub Pages

`npm run build && npm run deploy`

## Additional Info

* This project was bootstrapped with Create React App, and has been ejected to enable customization of webpack.
* Two polyfill packages are implemented to support IE11: `react-app-polyfill/ie11`, and `babel-polyfill`.  They must be imported *in that order* in `src/index.js`.  Eventually, if IE11 support is no longer required, those two import statements (and the `babel-polyfill` npm package) can be safely removed.

## AKS Deployment

**Prerequisites**

* Azure CLI <https://docs.microsoft.com/en-us/cli/azure/install-azure-cli?view=azure-cli-latest>
* Docker CLI <https://docs.docker.com/engine/reference/commandline/cli/>
* KUBECTL CLI (if deploying to AKS) <https://kubernetes.io/docs/tasks/tools/install-kubectl/>
* Azure Subscription
* Azure Container Registry (ACR)
* Azure Kubernetes Service (AKS)
* A DNS Zone has been configured with a sub-domain that points to an ingress controller in AKS
* An AKS Ingess Controller with TLS
  * Additional documentation: <https://docs.microsoft.com/en-us/azure/aks/ingress-static-ip>

### Scripts & Configuration Files

1. Log in with the Azure CLI: ```az login```
1. Select the appropriate Subscription. Ex: ```az account set --subscription "Sample_Subscription"```
1. Get credentials. Ex: ````az aks get-credentials --resource-group my-resources --name myAKS --overwrite-existing````
1. Rename ```kube-config-template.yml``` to ```kube-config.yml``` and update it with the following:
        - image locations
        - namespace for each section
        - host names in the Ingress section
1. Update ```deploy-aks.sh``` with the appropriate Azure Container Registry and Azure Container Key
1. Execute ```deploy-aks.sh```
1. For Azure DevOps pipeline configuration, update: ```azure-pipelines.yml```

The application will be available at the following URL: [<http://ip-dns-name.location.cloudapp.azure.com>]
The location in the URL will be the location of the Kubernetes cluster. Ex: eastus, centralus, etc...
