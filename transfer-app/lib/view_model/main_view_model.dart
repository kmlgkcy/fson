import 'dart:async';
import 'dart:convert';

import 'package:dio_wrapper/dio_wrapper.dart';
import 'package:flutter/foundation.dart';
import 'package:mobx/mobx.dart';
import 'package:url_launcher/url_launcher.dart';

import '../config.dart';
import '../model/download_file_model.dart';
import '../model/upload_file_model.dart';
import '../model/upload_task_model.dart';

part 'main_view_model.g.dart';

class MainViewModel = MainViewModelBase with _$MainViewModel;

abstract class MainViewModelBase with Store {
  @observable
  bool isLoading = false;

  @observable
  List<FileToDownload> filesToDownload = [];

  @observable
  List<FileToUpload> filesToUpload = [];

  @observable
  FileDirectory? availableFiles;

  @observable
  int downloadFileCount = 0;

  @observable
  int uploadFileCount = 0;

  @observable
  bool mode = true;

  @observable
  bool hostOnline = false;

  MainViewModelBase() {
    pingHost();

    Timer.periodic(const Duration(seconds: 5), (timer) async {
      await pingHost();
    });
  }

  String? room;

  final http = RequestManager.instance;

  @action
  void changeLoading() {
    isLoading = !isLoading;
  }

  @action
  void changeUploadList(FileToUpload file, bool? op) {
    if (op != null) {
      if (op) {
        filesToUpload.add(file);
      } else {
        filesToUpload.remove(file);
      }
    }
  }

  @action
  void changeDownloadList(FileToDownload file, bool? op) {
    if (op != null) {
      if (op) {
        filesToDownload.add(file);
      } else {
        filesToDownload.remove(file);
      }
    }
  }

  @action
  Future<void> download(String path) async {
    if (!hostOnline) {
      return;
    }
    final url = Uri.parse('$room/transfer?file=$path');
    await launchUrl(url);
  }

  @action
  Future<void> downloadSelected() async {
    if (!hostOnline) {
      return;
    }
    for (var element in filesToDownload) {
      await download(element.path);
    }
    await refresh();
  }

  @action
  Future<void> upload(FileToUpload file, Function(double) uploaded) async {
    try {
      if (!hostOnline) {
        return;
      }
      Res? taskResponse;
      taskResponse = await http.request(
        '$room/task',
        options: ReqOptions(
          method: HttpMethod.post.value,
          headers: {ReqResHeaders.contentTypeHeader: HttpContentType.json},
        ),
        data: jsonEncode({"name": file.name, "size": file.size, "totalChunk": file.totalChunks}),
      );
      if (taskResponse != null) {
        if (taskResponse.statusCode == 201) {
          file.task = UploadTask.fromJson(taskResponse.data);
        } else {
          return;
        }
      }
      bool isCompleted = false;
      bool errorHappened = false;
      int currentChunk = 1;

      while (!isCompleted && !errorHappened && (currentChunk <= file.task!.totalChunk!)) {
        uploaded(((currentChunk) / (file.task!.totalChunk!)));
        String address = '$room/transfer/${file.task!.id!}?chunk=$currentChunk';
        await http.request(
          address,
          options: ReqOptions(
            method: HttpMethod.post.value,
          ),
          data: http.multipartFormFromStream(file.getChunkStream(currentChunk), file.size),
        );
        file.task!.lastChunk = currentChunk;
        currentChunk++;
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  @action
  Future<void> refresh() async {
    changeLoading();
    filesToDownload.clear();
    filesToUpload.clear();
    try {
      Res? response;
      response = await http.request(
        '${AppConfig.apiUrl}/room',
        options: ReqOptions(method: HttpMethod.get.value),
      );
      if (response != null && response.statusCode == 200) {
        room = response.data;
        hostOnline = true;
        await getFiles();
      } else {
        hostOnline = false;
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }

  @action
  Future<void> pingHost() async {
    if (room == null) {
      hostOnline = false;
      return;
    }
    try {
      Res? response;
      response = await http.request(
        '$room/status',
        options: ReqOptions(
          method: HttpMethod.get.value,
        ),
      );
      if (response != null && response.statusCode == 200) {
        hostOnline = true;
      } else {
        hostOnline = false;
      }
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
  }

  Future<void> getFiles() async {
    if (room == null) {
      hostOnline = false;
      return;
    }
    changeLoading();
    try {
      Res? response;
      response = await http.request(
        '$room/transfer/dir',
        options: ReqOptions(
          contentType: HttpContentType.json,
          method: HttpMethod.get.value,
        ),
      );
      if (response != null && response.statusCode == 200) {
        availableFiles = FileDirectory.fromJson(response.data);
      } else {}
    } catch (e) {
      if (kDebugMode) {
        print(e);
      }
    }
    changeLoading();
  }
}
