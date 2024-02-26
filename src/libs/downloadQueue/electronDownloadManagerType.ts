import type {DownloadItem, SaveDialogOptions} from 'electron';

type Progress = {
    percent: number;
    transferredBytes: number;
    totalBytes: number;
};
type File = {
    filename: string;
    path: string;
    fileSize: number;
    mimeType: string;
    url: string;
};
type Options = {
    /**
    Show a `Save As…` dialog instead of downloading immediately.

    Note: Only use this option when strictly necessary. Downloading directly without a prompt is a much better user experience.

    @default false
    */
    readonly saveAs?: boolean;

    /**
    The directory to save the file in.

    Must be an absolute path.

    Default: [User's downloads directory](https://electronjs.org/docs/api/app/#appgetpathname)
    */
    readonly directory?: string;

    /**
    Name of the saved file.
    This option only makes sense for `electronDownloadManager.download()`.

    Default: [`downloadItem.getFilename()`](https://electronjs.org/docs/api/download-item/#downloaditemgetfilename)
    */
    readonly filename?: string;

    /**
    Title of the error dialog. Can be customized for localization.

    Note: Error dialog will not be shown in `electronDownloadManager.download()`. Please handle error manually.

    @default 'Download Error'
    */
    readonly errorTitle?: string;

    /**
    Message of the error dialog. `{filename}` is replaced with the name of the actual file. Can be customized for localization.

    Note: Error dialog will not be shown in `electronDownloadManager.download()`. Please handle error manually.

    @default 'The download of {filename} was interrupted'
    */
    readonly errorMessage?: string;

    /**
    Optional callback that receives the [download item](https://electronjs.org/docs/api/download-item).
    You can use this for advanced handling such as canceling the item like `item.cancel()`.
    */
    readonly onStarted?: (item: DownloadItem) => void;

    /**
    Optional callback that receives an object containing information about the progress of the current download item.
    */
    readonly onProgress?: (progress: Progress) => void;

    /**
    Optional callback that receives an object containing information about the combined progress of all download items done within any registered window.

    Each time a new download is started, the next callback will include it. The progress percentage could therefore become smaller again.
    This callback provides the same data that is used for the progress bar on the app icon.
    */
    readonly onTotalProgress?: (progress: Progress) => void;

    /**
    Optional callback that receives the [download item](https://electronjs.org/docs/api/download-item) for which the download has been cancelled.
    */
    readonly onCancel?: (item: DownloadItem) => void;

    /**
    Optional callback that receives an object with information about an item that has been completed. It is called for each completed item.
    */
    readonly onCompleted?: (file: File) => void;

    /**
    Reveal the downloaded file in the system file manager, and if possible, select the file.

    @default false
    */
    readonly openFolderWhenDone?: boolean;

    /**
    Show a file count badge on the macOS/Linux dock/taskbar icon when a download is in progress.

    @default true
    */
    readonly showBadge?: boolean;

    /**
    Show a progress bar on the dock/taskbar icon when a download is in progress.

    @default true
    */
    readonly showProgressBar?: boolean;

    /**
    Allow downloaded files to overwrite files with the same name in the directory they are saved to.

    The default behavior is to append a number to the filename.

    @default false
    */
    readonly overwrite?: boolean;

    /**
    Customize the save dialog.

    If `defaultPath` is not explicity defined, a default value is assigned based on the file path.

    @default {}
    */
    readonly dialogOptions?: SaveDialogOptions;

    /** Unregister the listener when the download is done. */
    readonly unregisterWhenDone?: boolean;
};

export type {Options, File, Progress};
