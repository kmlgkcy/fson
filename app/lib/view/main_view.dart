import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:fson_host_app/config.dart';
import 'package:fson_host_app/gen/translations.g.dart';
import 'package:fson_host_app/view_model/main_view_model.dart';
import 'package:qr_flutter/qr_flutter.dart';

class MainView extends StatefulWidget {
  const MainView({super.key});

  @override
  State<MainView> createState() => _MainViewState();
}

class _MainViewState extends State<MainView> {
  final _viewModel = MainViewModel();
  final controller = TextEditingController();
  @override
  Widget build(BuildContext context) {
    _viewModel.getHostStatus();
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        title: Text(
          'fson Admin',
          style: TextStyle(fontStyle: FontStyle.italic, fontWeight: FontWeight.bold, fontSize: 24),
        ),
      ),
      body: Column(
        children: [
          Card(
            child: Observer(
              builder: (context) => Row(
                children: [
                  Card(
                    color: _viewModel.roomOnline ? Colors.green : Colors.orange,
                    child: Row(
                      children: [
                        Card(
                          child: _viewModel.roomOnline
                              ? SizedBox.square(
                                  dimension: 24,
                                  child: ElevatedButton(
                                    onPressed: () {
                                      Clipboard.setData(ClipboardData(text: AppConfig.apiUrl));
                                    },
                                    style: ElevatedButton.styleFrom(
                                      alignment: Alignment.center,
                                      padding: const EdgeInsets.only(),
                                      backgroundColor: Colors.white,
                                    ),
                                    child: Icon(
                                      Icons.copy_all_outlined,
                                      color: Colors.blue,
                                    ),
                                  ),
                                )
                              : Icon(
                                  Icons.cloud_off_outlined,
                                ),
                        ),
                        Text(_viewModel.roomOnline ? t.title.room_online : t.title.room_offline),
                      ],
                    ),
                  ),
                  Spacer(),
                  SizedBox.square(
                    dimension: 24,
                    child: ElevatedButton(
                      onPressed: () {
                        _viewModel.openRoom(context);
                      },
                      style: ElevatedButton.styleFrom(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(),
                        backgroundColor: Colors.blue,
                      ),
                      child: Icon(Icons.play_arrow),
                    ),
                  ),
                  SizedBox.square(
                    dimension: 4,
                  ),
                  SizedBox.square(
                    dimension: 24,
                    child: ElevatedButton(
                      onPressed: () {
                        _viewModel.closeRoom(context);
                      },
                      style: ElevatedButton.styleFrom(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(),
                        backgroundColor: Colors.amber,
                      ),
                      child: Icon(Icons.pause_outlined),
                    ),
                  ),
                  SizedBox.square(
                    dimension: 4,
                  ),
                  SizedBox.square(
                    dimension: 24,
                    child: ElevatedButton(
                      onPressed: () {
                        _viewModel.clearTemps();
                      },
                      style: ElevatedButton.styleFrom(
                        alignment: Alignment.center,
                        padding: const EdgeInsets.only(),
                        backgroundColor: Colors.red,
                      ),
                      child: Icon(Icons.delete_sweep),
                    ),
                  ),
                ],
              ),
            ),
          ),
          Card(
            child: Row(
              children: [
                Text('Shared Directories'),
                Spacer(),
                SizedBox.square(
                  dimension: 24,
                  child: ElevatedButton(
                    onPressed: () async {
                      await _viewModel.getAllDirectories();
                    },
                    style: ElevatedButton.styleFrom(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.only(),
                      backgroundColor: Colors.green,
                    ),
                    child: Icon(Icons.refresh),
                  ),
                )
              ],
            ),
          ),
          Card(
            child: Row(
              children: [
                Expanded(
                  child: SizedBox(
                      height: 36,
                      child: TextFormField(
                        controller: controller,
                        decoration: InputDecoration(hintText: 'Add new Directory'),
                      )),
                ),
                SizedBox.square(
                  dimension: 24,
                  child: ElevatedButton(
                    onPressed: () async {
                      await _viewModel.addDirectory(controller.text);
                    },
                    style: ElevatedButton.styleFrom(
                      alignment: Alignment.center,
                      padding: const EdgeInsets.only(),
                      backgroundColor: Colors.green,
                    ),
                    child: Icon(Icons.add),
                  ),
                )
              ],
            ),
          ),
          Observer(
              builder: (BuildContext context) => Column(
                    children: [
                      ..._viewModel.sharedDirectories.map(
                        (e) => Card(
                          color: Colors.grey[200],
                          child: Padding(
                            padding: EdgeInsets.only(top: 4, bottom: 4),
                            child: Row(
                              children: [
                                Padding(
                                  padding: const EdgeInsets.only(right: 4, left: 4),
                                  child: SizedBox.square(
                                    dimension: 16,
                                    child: ElevatedButton(
                                      onPressed: () async {
                                        await _viewModel.removeDirectory(e);
                                      },
                                      style: ElevatedButton.styleFrom(
                                        alignment: Alignment.center,
                                        padding: const EdgeInsets.only(),
                                        backgroundColor: Colors.redAccent,
                                      ),
                                      child: Icon(Icons.close, size: 16),
                                    ),
                                  ),
                                ),
                                Expanded(child: Text(e)),
                              ],
                            ),
                          ),
                        ),
                      )
                    ],
                  )),
          SizedBox.square(dimension: 160, child: QrImage(data: AppConfig.apiUrl))
        ],
      ),
    );
  }
}
