using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers;
[ApiController]
[ServiceFilter(typeof(LogUserActivity))]
[Route("api/[controller]")]
public class AccountsController(DataContext context, ITokenService tokenService, IMapper mapper) : ControllerBase
{
    [HttpPost("register")]
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO){
        if(await UserExists(registerDTO.Username)) return BadRequest("Username is taken");
        
        using var hmac = new HMACSHA512();

        var user = mapper.Map<AppUser>(registerDTO);

        user.UserName = registerDTO.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
        user.PasswordSalt = hmac.Key;

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return new UserDTO{
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO){
        var user = await context.Users
            .Include(p => p.Photos)
            .FirstOrDefaultAsync(x => x.UserName == loginDTO.Username.ToLower());
        
        if(user == null) return Unauthorized("Invalid Username");

        using var hmac = new HMACSHA512(user.PasswordSalt);

        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if(computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }
        
        return new UserDTO{
            Username = user.UserName,
            Token = tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    private async Task<bool> UserExists(string username){
        return await context.Users.AnyAsync(x => x.UserName.ToLower() == username.ToLower());
    }
}
