export interface IErrorResponseModel {
    statusCode: number,
    message: string
}

export enum EError {
    REQUIRED = 'required',
    MIN_LENGTH = 'minlength',
    MAX_LENGTH = 'maxlength',
}