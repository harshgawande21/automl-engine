import sqlite3, os
path='autoinsight.db'
if not os.path.exists(path):
    print('db missing')
else:
    conn=sqlite3.connect(path)
    cur=conn.cursor()
    try:
        for row in cur.execute("SELECT id, name, email, role FROM user"):
            print(row)
    except Exception as e:
        print('error',e)
    finally:
        conn.close()
