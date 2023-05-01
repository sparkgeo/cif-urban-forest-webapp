export interface Municipalities {
  [key: string]: string[]
}
export interface Locations {
  provinces: string[]
  municipalities: Municipalities
}
export interface HandleProvinceCheckboxChangeProps {
  isChecked: boolean
  province: string
}

export interface HandleMunicipalityCheckboxChangeProps {
  municipalityDisplayIndex: number
  province: string
  isMunicipalityChecked: boolean
}

export interface LocationsStateProvinceValues {
  municipalitiesChecked?: boolean[]
  isAnyMunicipalityChecked?: boolean
  isProvinceIndeterminate?: boolean
}
export interface LocationsState {
  [key: string]: LocationsStateProvinceValues
}

export interface LocationsAction {
  type:
    | 'toggleAllMunicipalities'
    | 'toggleAllMunicipalitiesForProvince'
    | 'toggleMunicipalityChecked'
  payload: any // using a union type here necessitates typeguarding, which adds too many layers of conditionals in the reducer
}

export interface ToggleAllMunicipalitiesForProvinceProps {
  state: LocationsState
  action: LocationsAction
}
