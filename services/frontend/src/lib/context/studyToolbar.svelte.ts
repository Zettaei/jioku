export const STUDY_DECK_TOOLBAR_CONTEXT = "study_toolbar_context" as const;

export interface StudyDeckToolbarContextInterface {
    onEditClick: (() => void) | undefined;
    onDeleteClick: (() => void) | undefined;
}

export class StudyDeckToolbarContextClass implements StudyDeckToolbarContextInterface {

    onEditClick: (() => void) | undefined;
    onDeleteClick: (() => void) | undefined;
}