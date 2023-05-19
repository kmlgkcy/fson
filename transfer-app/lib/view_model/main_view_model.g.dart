// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'main_view_model.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$MainViewModel on MainViewModelBase, Store {
  late final _$isLoadingAtom =
      Atom(name: 'MainViewModelBase.isLoading', context: context);

  @override
  bool get isLoading {
    _$isLoadingAtom.reportRead();
    return super.isLoading;
  }

  @override
  set isLoading(bool value) {
    _$isLoadingAtom.reportWrite(value, super.isLoading, () {
      super.isLoading = value;
    });
  }

  late final _$filesToDownloadAtom =
      Atom(name: 'MainViewModelBase.filesToDownload', context: context);

  @override
  List<FileToDownload> get filesToDownload {
    _$filesToDownloadAtom.reportRead();
    return super.filesToDownload;
  }

  @override
  set filesToDownload(List<FileToDownload> value) {
    _$filesToDownloadAtom.reportWrite(value, super.filesToDownload, () {
      super.filesToDownload = value;
    });
  }

  late final _$filesToUploadAtom =
      Atom(name: 'MainViewModelBase.filesToUpload', context: context);

  @override
  List<FileToUpload> get filesToUpload {
    _$filesToUploadAtom.reportRead();
    return super.filesToUpload;
  }

  @override
  set filesToUpload(List<FileToUpload> value) {
    _$filesToUploadAtom.reportWrite(value, super.filesToUpload, () {
      super.filesToUpload = value;
    });
  }

  late final _$availableFilesAtom =
      Atom(name: 'MainViewModelBase.availableFiles', context: context);

  @override
  FileDirectory? get availableFiles {
    _$availableFilesAtom.reportRead();
    return super.availableFiles;
  }

  @override
  set availableFiles(FileDirectory? value) {
    _$availableFilesAtom.reportWrite(value, super.availableFiles, () {
      super.availableFiles = value;
    });
  }

  late final _$downloadFileCountAtom =
      Atom(name: 'MainViewModelBase.downloadFileCount', context: context);

  @override
  int get downloadFileCount {
    _$downloadFileCountAtom.reportRead();
    return super.downloadFileCount;
  }

  @override
  set downloadFileCount(int value) {
    _$downloadFileCountAtom.reportWrite(value, super.downloadFileCount, () {
      super.downloadFileCount = value;
    });
  }

  late final _$uploadFileCountAtom =
      Atom(name: 'MainViewModelBase.uploadFileCount', context: context);

  @override
  int get uploadFileCount {
    _$uploadFileCountAtom.reportRead();
    return super.uploadFileCount;
  }

  @override
  set uploadFileCount(int value) {
    _$uploadFileCountAtom.reportWrite(value, super.uploadFileCount, () {
      super.uploadFileCount = value;
    });
  }

  late final _$modeAtom =
      Atom(name: 'MainViewModelBase.mode', context: context);

  @override
  bool get mode {
    _$modeAtom.reportRead();
    return super.mode;
  }

  @override
  set mode(bool value) {
    _$modeAtom.reportWrite(value, super.mode, () {
      super.mode = value;
    });
  }

  late final _$hostOnlineAtom =
      Atom(name: 'MainViewModelBase.hostOnline', context: context);

  @override
  bool get hostOnline {
    _$hostOnlineAtom.reportRead();
    return super.hostOnline;
  }

  @override
  set hostOnline(bool value) {
    _$hostOnlineAtom.reportWrite(value, super.hostOnline, () {
      super.hostOnline = value;
    });
  }

  late final _$downloadAsyncAction =
      AsyncAction('MainViewModelBase.download', context: context);

  @override
  Future<void> download(String path) {
    return _$downloadAsyncAction.run(() => super.download(path));
  }

  late final _$downloadSelectedAsyncAction =
      AsyncAction('MainViewModelBase.downloadSelected', context: context);

  @override
  Future<void> downloadSelected() {
    return _$downloadSelectedAsyncAction.run(() => super.downloadSelected());
  }

  late final _$uploadAsyncAction =
      AsyncAction('MainViewModelBase.upload', context: context);

  @override
  Future<void> upload(FileToUpload file, dynamic Function(double) uploaded) {
    return _$uploadAsyncAction.run(() => super.upload(file, uploaded));
  }

  late final _$refreshAsyncAction =
      AsyncAction('MainViewModelBase.refresh', context: context);

  @override
  Future<void> refresh() {
    return _$refreshAsyncAction.run(() => super.refresh());
  }

  late final _$pingHostAsyncAction =
      AsyncAction('MainViewModelBase.pingHost', context: context);

  @override
  Future<void> pingHost() {
    return _$pingHostAsyncAction.run(() => super.pingHost());
  }

  late final _$MainViewModelBaseActionController =
      ActionController(name: 'MainViewModelBase', context: context);

  @override
  void changeLoading() {
    final _$actionInfo = _$MainViewModelBaseActionController.startAction(
        name: 'MainViewModelBase.changeLoading');
    try {
      return super.changeLoading();
    } finally {
      _$MainViewModelBaseActionController.endAction(_$actionInfo);
    }
  }

  @override
  void changeUploadList(FileToUpload file, bool? op) {
    final _$actionInfo = _$MainViewModelBaseActionController.startAction(
        name: 'MainViewModelBase.changeUploadList');
    try {
      return super.changeUploadList(file, op);
    } finally {
      _$MainViewModelBaseActionController.endAction(_$actionInfo);
    }
  }

  @override
  void changeDownloadList(FileToDownload file, bool? op) {
    final _$actionInfo = _$MainViewModelBaseActionController.startAction(
        name: 'MainViewModelBase.changeDownloadList');
    try {
      return super.changeDownloadList(file, op);
    } finally {
      _$MainViewModelBaseActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
isLoading: ${isLoading},
filesToDownload: ${filesToDownload},
filesToUpload: ${filesToUpload},
availableFiles: ${availableFiles},
downloadFileCount: ${downloadFileCount},
uploadFileCount: ${uploadFileCount},
mode: ${mode},
hostOnline: ${hostOnline}
    ''';
  }
}
