import AccessGrantedEntry from './AccessGrantedEntry'
import AccessProhibitedEntry from './AccessProhibitedEntry'

function pickEntryModelVariantBasedOnStatus (accessGranted) {
  return accessGranted === true
    ? AccessGrantedEntry
    : AccessProhibitedEntry
}

export function convertRawEntriesToEntryModels (entries) {
  return entries.map(({ id, uid, atTime, accessGranted }) => {
    const EntryVariant = pickEntryModelVariantBasedOnStatus(accessGranted)

    return new EntryVariant(id, uid, atTime)
  })
}
