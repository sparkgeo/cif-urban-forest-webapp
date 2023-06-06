import { styled } from '@mui/material'
import { TreeProperties } from '../../types/topLevelAppTypes'
import { theme } from '../../globalStyles/theme'

interface TreeMetadataProps {
  treeProperties: TreeProperties
}

const TreeMetadataTable = styled('table')`
  width: 350px;
  height: 350px;
  text-align: left;
  font-family: ${theme.typography.fontStack.join(',')};
  & th {
    padding-right: 0.5em;
    width: 155px;
  }
  & tr:nth-of-type(odd) {
    background-color: ${theme.color.grey[50]};
    border: solid thin black;
  }
`

export function TreeMetadata({ treeProperties }: TreeMetadataProps) {
  const {
    'Botanical Name Genus': botanicalGenus,
    'Botanical Name Species': botanicalSpecies,
    'Common Genus': commonGenus,
    'Common Species': commonSpecies,
    'Cultivar Name': cultivarName,
    'DBH (DHP) (CM)': diameter,
    Address: address,
    City: city,
  } = treeProperties
  return (
    <TreeMetadataTable>
      <tbody>
        <tr>
          <th>Common Species</th>
          <td>{commonSpecies}</td>
        </tr>
        <tr>
          <th>Location</th>
          <td>
            {address} {city}
          </td>
        </tr>
        <tr>
          <th>Diameter (DBH)</th>
          <td>{diameter ? <>{diameter} cm</> : null}</td>
        </tr>
        <tr>
          <th>Botanical Name Genus</th>
          <td>{botanicalGenus}</td>
        </tr>
        <tr>
          <th>Botanical Name Species</th>
          <td>{botanicalSpecies}</td>
        </tr>
        <tr>
          <th>Common Genus</th>
          <td>{commonGenus}</td>
        </tr>
        <tr>
          <th>Cultivar Name</th>
          <td>{cultivarName}</td>
        </tr>
      </tbody>
    </TreeMetadataTable>
  )
}
