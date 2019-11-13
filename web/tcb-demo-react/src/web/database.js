import React from 'react';

export class Database extends React.Component {
  constructor() {
    super();
    this.state = {
      app: {},
      execTime: 0,
      queryResult: '',
      queryTime: 0
    };
  }

  componentDidMount() {
    const app = window.tcb.init({
      env: 'scf-920ksf'
    });

    app.auth();

    this.setState({
      app
    });
  }

  async queryDB() {
    try {
      const start = Date.now();
      const db = this.state.app.database();
      const collection = db.collection('demo_web');
      const res = await collection.get();
      const end = Date.now();
      this.setState({
        queryResult: res.data.map(item => JSON.stringify(item)).join(' /n '),
        queryTime: end - start
      });
    } catch (err) {
      this.props.setErrorMsg(err.message);
    }
  }

  async addGeoPoint() {
    const db = this.state.app.database();
    const collection = db.collection('geo');

    const longitude = -180;
    const latitude = 20;
    const point = new db.Geo.Point(longitude, latitude);
    const initialData = {
      point,
      pointArr: [point, point, point],
      uuid: '416a4700-e0d3-11e8-911a-8888888888',
      string: '新增单个string字段1。新增单个string字段1。',
      due: new Date('2018-09-01'),
      int: 100,
      geo: new db.Geo.Point(90, 23),
      array: [
        {
          string: '99999999',
          due: new Date('2018-09-01'),
          geo: new db.Geo.Point(90, 23)
        },
        {
          string: '0000000',
          geo: new db.Geo.Point(90, 23),
          null: null
        }
      ]
    };
    try {
      const res = await collection.add(initialData);
      this.setState({
        queryResult: JSON.stringify(res)
      });
    } catch (e) {
      this.props.setErrorMsg(e.message);
    }
  }

  async advancedGeo() {
    const db = this.state.app.database();
    const collection = db.collection('geo');

    const {
      Point,
      LineString,
      Polygon,
      MultiPoint,
      MultiLineString,
      MultiPolygon
    } = db.Geo;

    function randomPoint() {
      return new Point(180 - 360 * Math.random(), 90 - 180 * Math.random());
    }

    const geoNearPoint = new Point(0, 0);
    const line = new LineString([randomPoint(), randomPoint()]);

    // “回”字的外环
    const point1 = new Point(-2, -2);
    const point2 = new Point(2, -2);
    const point3 = new Point(2, 2);
    const point4 = new Point(-2, 2);
    // “回”字的内环
    const point5 = new Point(-1, -1);
    const point6 = new Point(1, -1);
    const point7 = new Point(1, 1);
    const point8 = new Point(-1, 1);
    const polygon = new Polygon([
      new LineString([point1, point2, point3, point4, point1]),
      new LineString([point5, point6, point7, point8, point5])
    ]);

    const multiPoint = new MultiPoint([
      randomPoint(),
      randomPoint(),
      randomPoint(),
      randomPoint()
    ]);
    const multiLineString = new MultiLineString([
      new LineString([randomPoint(), randomPoint()]),
      new LineString([randomPoint(), randomPoint()]),
      new LineString([randomPoint(), randomPoint()]),
      new LineString([randomPoint(), randomPoint()])
    ]);
    const multiPolygon = new MultiPolygon([
      new Polygon([new LineString([point1, point2, point3, point4, point1])]),
      new Polygon([new LineString([point5, point6, point7, point8, point5])])
    ]);

    const initialData = {
      point: randomPoint(),
      geoNearPoint,
      line,
      polygon,
      multiPoint,
      multiLineString,
      multiPolygon
    };

    try {
      const res = await collection.add(initialData);
      this.setState({
        queryResult: JSON.stringify(res)
      });
    } catch (e) {
      this.props.setErrorMsg(e.message);
    }
  }

  async getGeoData() {
    try {
      const db = this.state.app.database();
      const collection = db.collection('geo');
      const res = await collection.get();
      console.log(res);
      this.setState({
        queryResult: res.data.map(item => JSON.stringify(item)).join(' /n ')
      });
    } catch (e) {
      this.props.setErrorMsg(e.message);
    }
  }

  render() {
    const { queryResult, queryTime } = this.state;
    return (
      <div className="database">
        <div className="group-item">
          <h4>普通查询</h4>
          <div>
            <button onClick={() => this.queryDB()}>查询记录</button>
          </div>
        </div>
        <div className="group-item">
          <h4>新增 GEO Point</h4>
          <div>
            <button onClick={() => this.addGeoPoint()}>插入数据</button>
          </div>
        </div>
        <div className="group-item">
          <h4>新增复杂 GEO 数据</h4>
          <div>
            <button onClick={() => this.advancedGeo()}>插入数据</button>
          </div>
        </div>
        <div className="group-item">
          <h4>GEO 查询</h4>
          <div>
            <button onClick={() => this.getGeoData()}>查询 GEO 数据</button>
          </div>
        </div>
        <div style={{ marginTop: '10px' }}>
          结果：
          <br />
          {queryResult}
        </div>
        <div style={{ marginTop: '10px' }}>耗时： {queryTime} ms</div>
      </div>
    );
  }
}
