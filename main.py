

from flask import Flask, request, redirect, render_template, session, flash
from flask_sqlalchemy import SQLAlchemy

#import MySQLdb

app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://StoneDeal:tunetracker@StoneDeal.mysql.pythonanywhere-services.com/StoneDeal$tune-tracker-new'
app.config['SQLALCHEMY_ECHO'] = True
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
app.secret_key = 'y44tkGcys&zP3BJ'

'''
db = MySQLdb.connect(host="StoneDeal.mysql.pythonanywhere-services.com",
                     user="StoneDeal",
                     passwd="tunetracker",
                     db="StoneDeal$tune-tracker-new")
cur = db.cursor()
'''

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(120), unique=True)
    password = db.Column(db.String(120))
    artists = db.relationship('Artist', backref='owner')

    def __init__(self, username, password):
        self.username = username
        self.password = password

    def __repr__(self):
        return '<User %r>' % self.username

class Artist(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    mbid = db.Column(db.String(120))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, mbid, owner):
        self.mbid = mbid
        self.owner = owner

'''
@app.before_request
def require_login():
    allowed_routes = ['login', 'signup', 'home', 'index', 'artist']
    if request.endpoint not in allowed_routes and 'user' not in session:
        return redirect('/home')
'''


@app.route("/", methods=['POST', 'GET'])
def index():
    return redirect("/home")


@app.route("/home", methods=['POST', 'GET'])
def home():
    return render_template('index.html')


@app.route("/artist", methods=['POST', 'GET'])
def artist():
    return render_template('artist.html')


@app.route("/profile", methods=['POST', 'GET'])
def profile():
    artist_error = ''
    if 'user' not in session:
        return redirect("/login")
    if request.args.get('artist') != None:
        artist_mbid = request.args.get('artist')
        artist_db_count = Artist.query.filter_by(mbid=artist_mbid, owner_id=session['user_id']).count()
        if artist_db_count == 0:
            owner = User.query.filter_by(username=session['user']).first()
            new_artist = Artist(artist_mbid, owner)
            db.session.add(new_artist)
            db.session.commit()
    liked_artist_count = Artist.query.filter_by(owner_id=session['user_id']).count()
    artist_tags = []
    if liked_artist_count > 0:
        liked_artists = Artist.query.filter_by(owner_id=session['user_id'])
        for artist in liked_artists:
            artist_tags.append(artist.mbid)
    return render_template('profile.html', artist_tags=artist_tags)


@app.route('/unlike-artist', methods=['POST'])
def unlike_artist():

    artist_mbid = request.form['artist-id']
    Artist.query.filter_by(owner_id=session['user_id'], mbid=artist_mbid).delete()
    db.session.commit()
    return redirect('/profile')


@app.route("/recommended", methods=['POST', 'GET'])
def recommended():
    if 'user' not in session:
        return redirect("/login")
    liked_artist_count = Artist.query.filter_by(owner_id=session['user_id']).count()
    artist_tags = []
    if liked_artist_count > 0:
        liked_artists = Artist.query.filter_by(owner_id=session['user_id'])
        for artist in liked_artists:
            artist_tags.append(artist.mbid)
    return render_template('recommended.html', artist_tags=artist_tags)


@app.route("/login", methods=['GET', 'POST'])
def login():
    login_error = ''
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        users = User.query.filter_by(username=username)
        if users.count() == 1:
            user = users.first()
            if password == user.password:
                session['user'] = user.username
                session['user_id'] = user.id
                flash('welcome back, '+user.username)
                return redirect("/home")
        login_error = 'Bad username or password.'
        return render_template("login.html", login_error=login_error, username=username)


def valid_user(string):
    error_count = 0

    if string == '':
        error_count += 1
    for char in string:
        if char == ' ':
            error_count += 1
    u_len = len(string)
    if u_len > 20 or u_len < 3:
        error_count += 1
    if error_count == 0:
        return True
    else:
        return False

def valid_pass(string):
    error_count = 0

    for char in string:
        if char == ' ':
            error_count += 1
    p_len = len(string)
    if p_len > 20 or p_len < 3:
        error_count += 1
    if error_count == 0:
        return True
    else:
        return False


@app.route("/signup", methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        verify = request.form['verify']
        username_error = ' '
        password_error = ' '
        password_match_error = ' '
        user_taken_error = ' '
        error_count = 0
        if valid_user(username) == False:
            error_count += 1
            username_error = "Please enter a valid username."
        user_db_count = User.query.filter_by(username=username).count()
        if user_db_count > 0:
            error_count += 1
            user_taken_error = "Sorry! That username is already taken."
        if valid_pass(password) == False:
            error_count += 1
            password_error = "Please enter a valid password."
        if password != verify:
            error_count += 1
            password_match_error = "Passwords did not match."
        if error_count == 0:
            user = User(username=username, password=password)
            db.session.add(user)
            db.session.commit()
            session['user'] = user.username
            session['user_id'] = user.id
            return redirect("/home")
        else:
            return render_template('signup.html', username=username, username_error=username_error, password_match_error=password_match_error, password_error=password_error)
    else:
        return render_template('signup.html')


@app.route("/logout", methods=['POST'])
def logout():
    del session['user']
    del session['user_id']
    return redirect("/login")


if __name__ == '__main__':
    app.run()