import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { HtmlRendererService } from '@app/core'
import { ConfirmService } from '@app/core/confirm/confirm.service'
import { POP_STATE_MODAL_DISMISS } from '@app/helpers'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap/modal/modal-ref'

@Component({
  selector: 'my-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: [ './confirm.component.scss' ]
})
export class ConfirmComponent implements OnInit {
  @ViewChild('confirmModal', { static: true }) confirmModal: ElementRef

  title = ''
  message = ''
  expectedInputValue = ''
  inputLabel = ''

  inputValue = ''
  confirmButtonText = ''

  private openedModal: NgbModalRef

  constructor (
    private modalService: NgbModal,
    private html: HtmlRendererService,
    private confirmService: ConfirmService
  ) { }

  ngOnInit () {
    this.confirmService.showConfirm.subscribe(
      ({ title, message, expectedInputValue, inputLabel, confirmButtonText }) => {
        this.title = title

        this.inputLabel = inputLabel
        this.expectedInputValue = expectedInputValue

        this.confirmButtonText = confirmButtonText || $localize`Confirm`

        this.html.toSafeHtml(message)
          .then(message => {
            this.message = message

            this.showModal()
          })
      }
    )
  }

  confirm () {
    if (this.openedModal) this.openedModal.close()
  }

  isConfirmationDisabled () {
    // No input validation
    if (!this.inputLabel || !this.expectedInputValue) return false

    return this.expectedInputValue !== this.inputValue
  }

  showModal () {
    this.inputValue = ''

    this.openedModal = this.modalService.open(this.confirmModal, { centered: true })

    this.openedModal.result
        .then(() => this.confirmService.confirmResponse.next(true))
        .catch((reason: string) => {
          // If the reason was that the user used the back button, we don't care about the confirm dialog result
          if (!reason || reason !== POP_STATE_MODAL_DISMISS) {
            this.confirmService.confirmResponse.next(false)
          }
        })
  }
}
