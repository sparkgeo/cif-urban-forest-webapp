import { Checkbox, FormControlLabel, List, ListItem, styled } from '@mui/material'
import { ChangeEvent, useState } from 'react'
import { CifFormControlLabel } from './CifFormControlLabel'

interface Locations {
  provinces: string[]
  municipalities: { [key: string]: string[] }
}

const locations: Locations = {
  provinces: ['British Columbia', 'Alberta', 'Ontario'],
  municipalities: {
    'British Columbia': ['Penticton', 'Princton', 'Kimberley', 'Vancouver', 'Youbou', 'Greenwood'],
    Alberta: ['Vulcan', 'Calgary', 'Longview', 'Coleman'],
  },
}

const { provinces, municipalities } = locations

const SideBarWrapper = styled('div')``

export function Sidebar() {
  const [provincesChecked, setProvincesChecked] = useState<boolean[]>([true, false, true])
  const provincesCheckedCount = provincesChecked.filter((isChecked) => isChecked).length
  const isAnyProvinceChecked = !!provincesCheckedCount

  interface HandleProvincesChanged {
    index: number
    checked: boolean
  }
  const handleProvinceCheckboxChange = ({ index, checked }: HandleProvincesChanged) => {
    const provincesCheckedCopy = structuredClone(provincesChecked)
    provincesCheckedCopy[index] = checked
    setProvincesChecked(provincesCheckedCopy)
  }

  const handleLocationCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const provincesToBeChecked: boolean[] = provinces.map(() => event.target.checked)
    setProvincesChecked(provincesToBeChecked)
    // make this checked logic like location. it pulls its state from municipalities
  }

  const provinceCheckboxes = (
    <List dense>
      {/* TODO  make list a reusable compoent */}
      {provinces.map((province, index) => (
        <ListItem key={province}>
          <CifFormControlLabel
            label={province}
            control={
              <Checkbox
                checked={provincesChecked[index]}
                onChange={(event) =>
                  handleProvinceCheckboxChange({ checked: event.target.checked, index })
                }
              />
            }
          />

          <List dense>
            {municipalities[province]?.map((municipality, index) => {
              return (
                <ListItem key={municipality}>
                  <CifFormControlLabel label={municipality} control={<Checkbox />} />
                </ListItem>
              )
            })}
          </List>
        </ListItem>
      ))}
    </List>
  )
  return (
    <SideBarWrapper>
      <CifFormControlLabel
        label="Locations"
        control={
          <Checkbox
            checked={isAnyProvinceChecked}
            indeterminate={isAnyProvinceChecked && provincesCheckedCount < provinces.length}
            onChange={handleLocationCheckboxChange}
          />
        }
      />
      {provinceCheckboxes}
    </SideBarWrapper>
  )
}
