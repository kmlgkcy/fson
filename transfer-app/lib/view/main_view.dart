import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../../gen/translations.g.dart';
import '../view_model/main_view_model.dart';
import 'download_view.dart';
import 'upload_view.dart';

class MainView extends StatefulWidget {
  const MainView({
    Key? key,
  }) : super(key: key);

  @override
  State<MainView> createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  final _viewModel = MainViewModel();

  @override
  void initState() {
    _viewModel.refresh();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (context) => Scaffold(
        appBar: AppBar(
          centerTitle: true,
          title: const Text(
            'fson',
            style: TextStyle(fontStyle: FontStyle.italic, fontWeight: FontWeight.bold, fontSize: 24),
          ),
          leading: const Text(
            '0.0.1',
            style: TextStyle(fontStyle: FontStyle.italic, fontSize: 8),
          ),
        ),
        body: SingleChildScrollView(
          child: Column(
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        _viewModel.mode = true;
                      },
                      style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.zero)),
                          padding: EdgeInsets.zero,
                          backgroundColor: Colors.blue),
                      child: Text(t.action.download),
                    ),
                  ),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () {
                        _viewModel.mode = false;
                      },
                      style: ElevatedButton.styleFrom(
                          shape: const RoundedRectangleBorder(borderRadius: BorderRadius.all(Radius.zero)),
                          padding: EdgeInsets.zero,
                          backgroundColor: Colors.green),
                      child: Text(t.action.upload),
                    ),
                  ),
                ],
              ),
              Card(
                // color: const Color(0xffE96479),
                child: SizedBox(
                  height: 40,
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Card(
                        color: _viewModel.hostOnline ? Colors.lightGreen : Colors.red,
                        child: Padding(
                          padding: const EdgeInsets.only(right: 4),
                          child: Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            mainAxisAlignment: MainAxisAlignment.start,
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Card(child: Icon(_viewModel.hostOnline ? Icons.wifi_outlined : Icons.wifi_off_outlined)),
                              const Text('Room'),
                            ],
                          ),
                        ),
                      ),
                      Row(
                        children: [
                          if (_viewModel.mode)
                            SizedBox(
                              width: 30,
                              height: 30,
                              child: ElevatedButton(
                                onPressed: () {
                                  _viewModel.downloadSelected();
                                },
                                style: const ButtonStyle(
                                  padding: MaterialStatePropertyAll(EdgeInsets.zero),
                                  backgroundColor: MaterialStatePropertyAll(Colors.blue),
                                ),
                                child: const Icon(Icons.downloading_rounded),
                              ),
                            ),
                          Padding(
                            padding: const EdgeInsets.only(left: 8, right: 8),
                            child: SizedBox(
                              width: 30,
                              height: 30,
                              child: ElevatedButton(
                                style: const ButtonStyle(
                                  padding: MaterialStatePropertyAll(EdgeInsets.zero),
                                  backgroundColor: MaterialStatePropertyAll(Colors.amber),
                                ),
                                onPressed: () async {
                                  await _viewModel.refresh();
                                },
                                child: const Icon(Icons.refresh_rounded),
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                ),
              ),

              Padding(
                  padding: const EdgeInsetsDirectional.only(bottom: 16, start: 16, top: 0, end: 16),
                  child: _viewModel.isLoading
                      ? progressIndicator
                      : _viewModel.hostOnline
                          ? _viewModel.mode
                              ? (_viewModel.availableFiles != null)
                                  ? SingleChildScrollView(
                                      child: DownloadView(
                                        path: const [],
                                        model: _viewModel.availableFiles!,
                                        changeDownloadList: _viewModel.changeDownloadList,
                                        onDownload: _viewModel.download,
                                        expanded: true,
                                      ),
                                    )
                                  : Center(child: Text(t.message.host_not_provided_any_file))
                              : UploadView(
                                  changeUploadList: _viewModel.changeUploadList,
                                  upload: _viewModel.upload,
                                  files: _viewModel.filesToUpload,
                                )
                          : Text(t.message.host_not_online)),
              // const Spacer(),
            ],
          ),
        ),
        // bottomNavigationBar: UploadView(addUploadFiles: _viewModel.pushAllUploadList),
      ),
    );
  }
}

Widget get progressIndicator => const Center(child: SizedBox.square(dimension: 64, child: CircularProgressIndicator()));
