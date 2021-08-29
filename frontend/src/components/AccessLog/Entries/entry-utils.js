import AccessGrantedEntry from './AccessGrantedEntry'
import AccessProhibitedEntry from './AccessProhibitedEntry'

function pickEntryModelVariantBasedOnStatus (accessGranted) {
  return accessGranted === true
    ? AccessGrantedEntry
    : AccessProhibitedEntry
}

export function convertRawEntriesToEntryModels (entries) {
  // eslint-disable-next-line camelcase
  return entries.map(({ id, uid, at_time, access_granted }) => {
    const EntryVariant = pickEntryModelVariantBasedOnStatus(access_granted)

    return new EntryVariant(id, uid, at_time)
  })
}
