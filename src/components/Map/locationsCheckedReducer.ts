import {
  LocationsState,
  ToggleAllMunicipalitiesForProvinceProps,
} from '../../types/locationsFilterTypes'

const toggleAllMunicipalitiesForProvince = ({
  action,
  state,
}: ToggleAllMunicipalitiesForProvinceProps) => {
  const { province, municipalities, isChecked } = action.payload

  const municipalitiesInProvinceLength = municipalities[province]?.length

  const updatedMunicipalitiesCheckedForProvince = Array.from(
    { length: municipalitiesInProvinceLength },
    () => isChecked,
  )
  const updatedState = {
    ...state,
    [province]: {
      isAnyMunicipalityChecked: isChecked,
      isProvinceIndeterminate: false,
      municipalitiesChecked: updatedMunicipalitiesCheckedForProvince,
    },
  }

  return updatedState
}

export function locationsCheckedReducer(state: LocationsState, action: LocationsAction) {
  switch (action.type) {
    case 'toggleAllMunicipalities': {
      let updatedState: LocationsState = state
      const { payload } = action
      payload.provinces?.forEach((province: string) => {
        updatedState = toggleAllMunicipalitiesForProvince({
          action: { ...action, payload: { ...payload, province } },
          state: updatedState,
        })
      })
      return updatedState
    }
    case 'toggleAllMunicipalitiesForProvince': {
      return toggleAllMunicipalitiesForProvince({ state, action })
    }
    case 'toggleMunicipalityChecked': {
      const { province, municipalityDisplayIndex, isMunicipalityChecked, municipalities } =
        action.payload

      const updatedMunicipalitiesChecked = state[province]?.municipalitiesChecked ?? []
      updatedMunicipalitiesChecked[municipalityDisplayIndex] = isMunicipalityChecked

      const updatedMunicipalitiesCheckedCount: number = updatedMunicipalitiesChecked.filter(
        (isChecked) => isChecked,
      ).length
      const isAnyMunicipalityChecked = !!updatedMunicipalitiesCheckedCount
      const areSomeButNotAllMunicipalitiesChecked =
        isAnyMunicipalityChecked &&
        updatedMunicipalitiesCheckedCount < municipalities[province].length

      const updatedState = {
        ...state,
        [province]: {
          municipalitiesChecked: updatedMunicipalitiesChecked,
          isAnyMunicipalityChecked,
          isProvinceIndeterminate: areSomeButNotAllMunicipalitiesChecked,
        },
      }
      return updatedState
    }
    default:
      throw new Error("This action isn't supported by the locationsCheckedReducer")
  }
}
