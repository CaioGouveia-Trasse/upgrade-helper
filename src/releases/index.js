import { PACKAGE_NAMES } from '../constants'

// Use import.meta.glob to import all release files at build time
const rnModules = import.meta.glob('./react-native/*.tsx', { eager: true })
const rnmModules = import.meta.glob('./react-native-macos/*.tsx', { eager: true })
const rnwModules = import.meta.glob('./react-native-windows/*.tsx', { eager: true })

const versionsWithContent = {
  [PACKAGE_NAMES.RN]: [
    '0.77',
    '0.73',
    '0.74',
    '0.72',
    '0.71',
    '0.69',
    '0.68',
    '0.64',
    '0.62',
    '0.61',
    '0.60',
    '0.59',
    '0.58',
    '0.57',
  ],
  [PACKAGE_NAMES.RNM]: [],
  [PACKAGE_NAMES.RNW]: [],
}

const moduleMap = {
  [PACKAGE_NAMES.RN]: rnModules,
  [PACKAGE_NAMES.RNM]: rnmModules,
  [PACKAGE_NAMES.RNW]: rnwModules,
}

const getReleaseVersionFiles = (packageName) =>
  versionsWithContent[packageName].map((version) => {
    const modulePath = `./${packageName}/${version}.tsx`
    const module = moduleMap[packageName][modulePath]
    return {
      ...module.default,
      version,
    }
  })

export default {
  [PACKAGE_NAMES.RN]: getReleaseVersionFiles(PACKAGE_NAMES.RN),
  [PACKAGE_NAMES.RNM]: getReleaseVersionFiles(PACKAGE_NAMES.RNM),
  [PACKAGE_NAMES.RNW]: getReleaseVersionFiles(PACKAGE_NAMES.RNW),
}
