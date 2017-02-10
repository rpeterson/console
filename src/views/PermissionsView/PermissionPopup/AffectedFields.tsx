import * as React from 'react'
import * as Relay from 'react-relay'
import {$p, variables, Icon, $g} from 'graphcool-styles'
import * as cx from 'classnames'
import {Operation, Field} from '../../../types/types'
import mapProps from '../../../components/MapProps/MapProps'
import PermissionField from '../PermissionsList/ModelPermissions/PermissionField'
import {validPermissionField} from '../../../utils/valueparser'

interface Props {
  fields: Field[]
  fieldIds: string[]
  toggleField: (id: string) => void
  selectedOperation: Operation
  applyToWholeModel: boolean
  toggleApplyToWholeModel: () => void
  onSelectAll: () => void
  onReset: () => void
}

class AffectedFields extends React.Component<Props, {}> {

  render() {
    const {
      fields,
      fieldIds,
      toggleField,
      selectedOperation,
      applyToWholeModel,
      toggleApplyToWholeModel,
      onReset,
      onSelectAll,
    } = this.props
    const fieldsFiltered = fields
      .filter(field => validPermissionField(selectedOperation, field))

    return (
      <div className='wrapper'>
        <style jsx={true}>{`
          .intro {
            @p: .black50, .mr38;
          }
          .buttons {
            @p: .flex, .justifyEnd, .mr25, .mv25;
          }
          .button {
            @p: .buttonShadow, .f14, .fw6, .ttu, .black30, .pointer;
            padding: 7px 9px;
          }
          .button + .button {
            @p: .ml10;
          }
        `}</style>
        <div className={cx($p.pl38, $p.pr25)}>
          <div className={cx($p.flex, $p.flexRow, $p.itemsStart, $p.justifyBetween, $p.pb25)}>
            <div className='intro'>
              Select the fields that should be affected by this permission.
            </div>
            <div
              className={cx(
                $p.pv6, $p.ph10, $p.ttu, $p.f14, $p.fw6, $p.pointer, $p.flex, $p.flexRow, $p.itemsCenter, $p.br2,
                $p.buttonShadow, $p.nowrap,
                {
                  [cx($p.bgWhite, $p.blue)]: !applyToWholeModel,
                  [cx($p.bgBlue, $p.white)]: applyToWholeModel,
                },
              )}
              onClick={toggleApplyToWholeModel}
            >
              {applyToWholeModel && (
                <Icon
                  src={require('graphcool-styles/icons/fill/check.svg')}
                  color={variables.white}
                  className={$p.mr4}
                />
              )}
              Apply to whole Model
            </div>
          </div>
          <div className={$p.mt16}>
            {fieldsFiltered.length === 0 && (
              <div className={$p.brown}>
                No fields can be effected by this permission,
                as mutation permissions can't be applied to readonly fields
              </div>
            )}
            {fieldsFiltered
              .map(field => (
                <PermissionField
                  key={field.id}
                  field={field}
                  disabled={applyToWholeModel}
                  selected={fieldIds.includes(field.id) || applyToWholeModel}
                  onClick={() => toggleField && toggleField(field.id)}
                  className={cx($p.pointer, $p.mr10, $p.mb10)}
                />
              ),
            )}
          </div>
        </div>
        <div className='buttons'>
          <div className='button' onClick={onSelectAll}>Select All</div>
          <div className='button' onClick={onReset}>Reset</div>
        </div>
      </div>
    )
  }
}

const MappedAffectedFields = mapProps({
  fields: props => {
    return props.model.fields.edges.map(edge => edge.node)
  },
})(AffectedFields)

export default Relay.createContainer(MappedAffectedFields, {
  fragments: {
    model: () => Relay.QL`
      fragment on Model {
        fields(first: 100) {
          edges {
            node {
              id
              isReadonly
              name
              typeIdentifier
            }
          }
        }
      }
    `,
  },
})
